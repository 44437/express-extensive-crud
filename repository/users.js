const { UserDB, UserRes } = require("../model/user");
const { ReasonPhrases } = require("http-status-codes");
const connectionPool = require("./index");

class UsersRepository {
  static getUsers = () => {
    return new Promise((resolve, reject) => {
      connectionPool.execute("SELECT * FROM users", (err, results, _) => {
        if (err) {
          reject(err);
          return;
        }

        const users = results
          .map((user) => {
            const { error: errorUserDB, value: valueUserDB } = UserDB.validate(user);
            if (errorUserDB) {
              reject(errorUserDB);
              return;
            }

            const { error: errorUserRes, value: valueUserRes } = UserRes.validate({
              id: valueUserDB.id,
              name: valueUserDB.name,
              surname: valueUserDB.surname,
              username: valueUserDB.name + valueUserDB.surname,
            });
            if (errorUserRes) {
              reject(errorUserRes);
              return;
            }

            return valueUserRes;
          })
          .filter((user) => user !== null);

        resolve(users);
      });
    });
  };

  static createUser = (user) => {
    return new Promise((resolve, reject) => {
      connectionPool.execute(
        "INSERT INTO users (name, surname) VALUES (?, ?)",
        [user.name || null, user.surname || null],
        (error, results) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(results.insertId);
        },
      );
    });
  };

  static getUserByID = (userID) => {
    return new Promise((resolve, reject) => {
      connectionPool.execute("SELECT * FROM users WHERE id = ?", [userID], (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const { error: errorUserDB, value: valueUserDB } = UserDB.validate(results[0]);
        if (errorUserDB || valueUserDB === undefined) {
          reject(errorUserDB || ReasonPhrases.NOT_FOUND);
          return;
        }

        const { error: errorUserRes, value: valueUserRes } = UserRes.validate({
          id: valueUserDB.id,
          name: valueUserDB.name,
          surname: valueUserDB.surname,
          username: valueUserDB.name + valueUserDB.surname,
        });
        if (errorUserRes) {
          reject(errorUserRes);
          return;
        }

        resolve(valueUserRes);
      });
    });
  };

  static updateUserPUT = (user, userID) => {
    return new Promise((resolve, reject) => {
      connectionPool.execute(
        `UPDATE users SET ${user.name ? `name = '${user.name}'` : ""} ${user.surname ? `, surname = '${user.surname}'` : ""} WHERE id = ${userID}`,
        (error, _) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        },
      );
    });
  };

  static deleteUser = (userID) => {
    return new Promise((resolve, reject) => {
      connectionPool.execute("DELETE FROM users WHERE id = ?", [userID], (error, _) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  };
}

module.exports = UsersRepository;
