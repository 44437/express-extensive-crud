const { UserDB, UserRes } = require("../model/user");
const { ReasonPhrases } = require("http-status-codes");

function UsersRepository(connectionPool) {
  this.connectionPool = connectionPool;
}

UsersRepository.prototype.getUsers = function () {
  return new Promise((resolve, reject) => {
    this.connectionPool.execute("SELECT * FROM users", (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      const users = results
        .map((user) => {
          const { error: errorUserDB, value: valueUserDB } = UserDB.validate(user);
          if (errorUserDB) {
            console.log(errorUserDB);
            return null;
          }

          const { error: errorUserRes, value: valueUserRes } = UserRes.validate({
            id: valueUserDB.id,
            name: valueUserDB.name,
            surname: valueUserDB.surname,
            username: valueUserDB.name + (valueUserDB.surname !== null ? valueUserDB.surname : valueUserDB.id),
          });
          if (errorUserRes) {
            console.log(errorUserRes);
            return null;
          }

          return valueUserRes;
        })
        .filter((user) => user !== null);

      resolve(users);
    });
  });
};

UsersRepository.prototype.createUser = function (user) {
  return new Promise((resolve, reject) => {
    this.connectionPool.execute(
      "INSERT INTO users (name, surname) VALUES (?, ?)",
      [user.name || null, user.surname || null],
      (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }

        resolve(results.insertId);
      },
    );
  });
};

UsersRepository.prototype.getUserByID = function (userID) {
  return new Promise((resolve, reject) => {
    this.connectionPool.execute("SELECT * FROM users WHERE id = ?", [userID], (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      const { error: errorUserDB, value: valueUserDB } = UserDB.validate(results[0]);
      if (errorUserDB) {
        console.log(errorUserDB);
        reject(errorUserDB);
        return;
      }

      const { error: errorUserRes, value: valueUserRes } = UserRes.validate({
        id: valueUserDB.id,
        name: valueUserDB.name,
        surname: valueUserDB.surname,
        username: valueUserDB.name + (valueUserDB.surname !== null ? valueUserDB.surname : valueUserDB.id),
      });
      if (errorUserRes) {
        console.log(errorUserRes);
        reject(errorUserRes);
        return;
      }

      resolve(valueUserRes);
    });
  });
};

UsersRepository.prototype.updateUser = function (user, userID) {
  return new Promise((resolve, reject) => {
    this.connectionPool.execute(
      `UPDATE users SET ${user.name ? `name = '${user.name}'` : ""} ${user.surname ? `, surname = '${user.surname}'` : ""} WHERE id = ${userID}`,
      (error, _) => {
        if (error) {
          console.log(error);
          reject(error);
          return;
        }

        resolve();
      },
    );
  });
};

UsersRepository.prototype.deleteUser = function (userID) {
  return new Promise((resolve, reject) => {
    this.connectionPool.execute("DELETE FROM users WHERE id = ?", [userID], (error, _) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }

      resolve();
    });
  });
};

module.exports = UsersRepository;
