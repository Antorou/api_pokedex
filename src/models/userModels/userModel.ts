import { connectionDB } from "../../db/connectionDB";
import logger from "../../logger";
import { User } from "../../types/user";

export async function createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [userData.username, userData.email, userData.password_hash]
    );

    const id = result.insertId;
    
    const [rows]: any = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    const newUser = rows[0] as User;
    
    return newUser;
  } catch (err) {
    logger.error("Error in createUser:", err);
    throw err;
  }
}

export async function findUserById(id: number): Promise<User | null> {
  try {
    const connection = await connectionDB();
    const [rows]: any = await connection.execute("SELECT * FROM users WHERE id = ?", [id]);

    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    logger.error(`Error in findUserById(${id}):`, err);
    throw err;
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const connection = await connectionDB();
    const [rows]: any = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    logger.error(`Error in findUserByEmail(${email}):`, err);
    throw err;
  }
}

export async function findUserByUsername(username: string): Promise<User | null> {
  try {
    const connection = await connectionDB();
    const [rows]: any = await connection.execute("SELECT * FROM users WHERE username = ?", [username]);

    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    logger.error(`Error in findUserByUsername(${username}):`, err);
    throw err;
  }
}

export async function updateUser(id: number, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute(
      `UPDATE users SET 
      username = ?, email = ?, password_hash = ?
      WHERE id = ?`,
      [
        userData.username,
        userData.email,
        userData.password_hash,
        id
      ]
    );

    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Error in updateUser(${id}):`, err);
    throw err;
  }
}

export async function deleteUser(id: number): Promise<boolean> {
  try {
    const connection = await connectionDB();
    const [result]: any = await connection.execute("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (err) {
    logger.error(`Error in deleteUser(${id}):`, err);
    throw err;
  }
}

export async function findAllUsers(): Promise<User[]> {
  try {
    const connection = await connectionDB();
    const [rows]: any = await connection.execute("SELECT * FROM users");
    return rows as User[];
  } catch (err) {
    logger.error("Error in findAllUsers:", err);
    throw err;
  }
}