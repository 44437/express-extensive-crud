const UsersRepository = require("../../repository/users");

const mockConnectionPool = {
  execute: jest.fn(),
};
const usersRepository = new UsersRepository(mockConnectionPool);

describe("getUsers", () => {
  it("should return all users", async () => {
    mockConnectionPool.execute.mockImplementation((query, callback) => {
      callback(null, [{ id: 1, name: "John", surname: "Doe" }]);
    });

    const users = await usersRepository.getUsers();
    expect(users[0].id).toEqual(1);
    expect(users[0].name).toEqual("John");
    expect(users[0].surname).toEqual("Doe");
    expect(users[0].username).toEqual("JohnDoe");
    expect(mockConnectionPool.execute).toHaveBeenCalledWith("SELECT * FROM users", expect.any(Function));
  });

  it("should reject the promise because of a db error", async () => {
    mockConnectionPool.execute.mockImplementation((query, callback) => {
      callback(Error("Something went wrong"), null);
    });

    await expect(usersRepository.getUsers()).rejects.toThrow(Error("Something went wrong"));
    expect(mockConnectionPool.execute).toHaveBeenCalledWith("SELECT * FROM users", expect.any(Function));
  });

  it("should return without a user because of the user's non-matching fields with the model UserDB", async () => {
    mockConnectionPool.execute.mockImplementation((query, callback) => {
      callback(null, [
        { id: 1, name: "John", surname: "Doe" },
        { id: 2, surname: "Doe" },
      ]);
    });

    const users = await usersRepository.getUsers();
    expect(users.length).toEqual(1);
    expect(users[0].id).toEqual(1);
    expect(users[0].name).toEqual("John");
    expect(users[0].surname).toEqual("Doe");
    expect(users[0].username).toEqual("JohnDoe");
    expect(mockConnectionPool.execute).toHaveBeenCalledWith("SELECT * FROM users", expect.any(Function));
  });
});

describe("createUser", () => {
  it("should insert a user and return the insertId", async () => {
    mockConnectionPool.execute.mockImplementation((query, values, callback) => {
      callback(null, { insertId: 1 });
    });

    const user = { name: "John", surname: "Doe" };
    const insertId = await usersRepository.createUser(user);

    expect(insertId).toBe(1);
    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "INSERT INTO users (name, surname) VALUES (?, ?)",
      [user.name, user.surname],
      expect.any(Function),
    );
  });

  it("should reject the promise because of a db error", async () => {
    mockConnectionPool.execute.mockImplementation((query, values, callback) => {
      callback(Error("Something went wrong"), null);
    });

    const user = { name: "John", surname: "Doe" };
    await expect(usersRepository.createUser(user)).rejects.toThrow(Error("Something went wrong"));
    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "INSERT INTO users (name, surname) VALUES (?, ?)",
      [user.name, user.surname],
      expect.any(Function),
    );
  });
});

describe("getUserByID", () => {
  it("should return the user", async () => {
    const userID = 1;

    mockConnectionPool.execute.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, name: "John", surname: "Doe" }]);
    });

    const user = await usersRepository.getUserByID(userID);
    expect(user.id).toEqual(userID);
    expect(user.name).toEqual("John");
    expect(user.surname).toEqual("Doe");
    expect(user.username).toEqual("JohnDoe");
    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [userID],
      expect.any(Function),
    );
  });

  it("should reject the promise because of a db error", async () => {
    const userID = 1;

    mockConnectionPool.execute.mockImplementation((query, value, callback) => {
      callback(Error("Something went wrong"), null);
    });

    await expect(usersRepository.getUserByID(userID)).rejects.toThrow(Error("Something went wrong"));
    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [userID],
      expect.any(Function),
    );
  });

  it("should return the promise because of the user's non-matching fields with the model UserDB", async () => {
    const userID = 1;

    mockConnectionPool.execute.mockImplementation((query, values, callback) => {
      callback(null, [{ id: 1, surname: "Doe" }]);
    });

    await expect(usersRepository.getUserByID(userID)).rejects.toThrow(Error('"name" is required'));
    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = ?",
      [userID],
      expect.any(Function),
    );
  });
});

describe("updateUser", () => {
  it("should update the user", async () => {
    mockConnectionPool.execute.mockImplementation((query, callback) => {
      callback(null, {});
    });

    const user = { name: "Jane" };
    const userID = 1;
    await usersRepository.updateUser(user, userID);

    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      `UPDATE users SET ${user.name ? `name = '${user.name}'` : ""} ${user.surname ? `, surname = '${user.surname}'` : ""} WHERE id = ${userID}`,
      expect.any(Function),
    );
  });

  it("should reject the promise because of a db error", async () => {
    mockConnectionPool.execute.mockImplementation((query, callback) => {
      callback(Error("Something went wrong"), null);
    });

    const user = { name: "Jane" };
    const userID = 1;
    await expect(usersRepository.updateUser(user, userID)).rejects.toThrow(Error("Something went wrong"));

    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      `UPDATE users SET ${user.name ? `name = '${user.name}'` : ""} ${user.surname ? `, surname = '${user.surname}'` : ""} WHERE id = ${userID}`,
      expect.any(Function),
    );
  });
});

describe("deleteUser", () => {
  it("should delete the user", async () => {
    mockConnectionPool.execute.mockImplementation((query, values, callback) => {
      callback(null, {});
    });

    const userID = 1;
    await usersRepository.deleteUser(userID);

    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "DELETE FROM users WHERE id = ?",
      [userID],
      expect.any(Function),
    );
  });

  it("should reject the promise because of a db error", async () => {
    mockConnectionPool.execute.mockImplementation((query, values, callback) => {
      callback(Error("Something went wrong"), null);
    });

    const userID = 1;
    await expect(usersRepository.deleteUser(userID)).rejects.toThrow(Error("Something went wrong"));

    expect(mockConnectionPool.execute).toHaveBeenCalledWith(
      "DELETE FROM users WHERE id = ?",
      [userID],
      expect.any(Function),
    );
  });
});
