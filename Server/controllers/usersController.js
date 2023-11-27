const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const joi = require("joi");

const {
  createUser,
  findUserByEmail,
  updateUser,
  softDeleteUser,
  getUsers,
} = require("../models/users");
const {
  createTrainer,
  findTrainerByEmail,
  updateTrainer,
  softDeleteTrainer,
  getTrainers,
} = require("../models/trainers");

async function userSignup(req, res) {
  const { firstname, lastname, email, password, role_id } = req.body;

  try {
    const schema = joi.object({
      firstname: joi.string().alphanum().min(3).max(20).required(),
      lastname: joi.string().min(3).max(20).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
          )
        )
        .required(),
    });

    const validate = schema.validate({
      firstname,
      lastname,
      email,
      password,
    });

    if (validate.error) {
      return res.status(405).json({ error: validate.error.details });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const newUser_id = await createUser({
      firstname,
      lastname,
      email,
      password,
      role_id,
    });

    res.status(201).json({
      message: "User added successfully",
      user_id: newUser_id,
    });
  } catch (error) {
    console.error("Failed to register : ", error);
    res.status(500).json({ error: "Failed to register" });
  }
}

async function trainerSignup(req, res) {
  const { firstname, lastname, email, password, field, degree } = req.body;

  try {
    const schema = joi.object({
      firstname: joi.string().alphanum().min(3).max(20).required(),
      lastname: joi.string().min(3).max(20).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
          )
        )
        .required(),
    });

    const validate = schema.validate({
      firstname,
      lastname,
      email,
      password,
    });

    if (validate.error) {
      return res.status(405).json({ error: validate.error.details });
    }

    const existingTrainer = await findTrainerByEmail(email);

    if (existingTrainer) {
      return res.status(409).json({ error: "Trainer already exists" });
    }

    const newTrainer_id = await createTrainer({
      firstname,
      lastname,
      email,
      password,
      field,
      degree,
    });

    res.status(201).json({
      message: "Trainer added successfully",
      trainer_id: newTrainer_id,
    });
  } catch (error) {
    console.error("Failed to register trainer: ", error);
    res.status(500).json({ error: "Failed to register trainer" });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (user) {
      let passwordMatch;

      // Conditionally hash the password based on role_id
      if (user.role_id !== 1) {
        // Hash the password if the role_id is not 1
        passwordMatch = await bcrypt.compare(password, user.password);
      } else {
        // No need to hash the password for role_id 1
        passwordMatch = password === user.password;
      }

      if (passwordMatch) {
        const token = jwt.sign(
          {
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            role_id: user.role_id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "4h",
          }
        );

        res.cookie("accessToken", token, {
          httpOnly: true,
          maxAge: 3600000,
        });

        res.json({
          message: "Login successful",
          user: {
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            role_id: user.role_id,
          },
          token,
        });
        console.log(`Token = ${token}`);
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login failed: ", error);
    res.status(500).json({ error: "Login failed" });
  }
}

async function loginTrainer(req, res) {
  const { email, password } = req.body;

  try {
    const trainer = await findTrainerByEmail(email);

    if (trainer) {
      const passwordMatch = await bcrypt.compare(password, trainer.password);

      if (passwordMatch) {
        const token = jwt.sign(
          {
            trainer_id: trainer.trainer_id,
            firstname: trainer.firstname,
            lastname: trainer.lastname,
            role_id: trainer.role_id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "4h",
          }
        );

        res.cookie("accessToken", token, {
          httpOnly: true,
          maxAge: 3600000,
        });

        res.json({
          message: "Login successful",
          trainer: {
            trainer_id: trainer.trainer_id,
            firstname: trainer.firstname,
            lastname: trainer.lastname,
            role_id: trainer.role_id,
          },
          token,
        });
        console.log(`Token = ${token}`);
      } else {
        res.status(401).json({ error: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login failed: ", error);
    res.status(500).json({ error: "Login failed" });
  }
}

const updateUserHandler = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Extract user_id from the token
    const user_id = req.user.user_id;

    const schema = joi.object({
      firstname: joi.string().alphanum().min(3).max(20).required(),
      lastname: joi.string().min(3).max(20).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
          )
        )
        .required(),
    });

    const { error } = schema.validate({
      firstname,
      lastname,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [recUpdated, updatedUser] = await updateUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      user_id,
    });

    if (recUpdated === 1) {
      return res
        .status(200)
        .json({ message: "User information updated successfully", user_id });
    } else {
      return res.status(404).json({ error: "User not found or not updated" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Update user failed" });
  }
};

const updateTrainerHandler = async (req, res) => {
  const { firstname, lastname, email, password, field, degree } = req.body;

  try {
    // Extract trainer_id from the token
    const trainer_id = req.user.trainer_id;

    const schema = joi.object({
      firstname: joi.string().alphanum().min(3).max(20).required(),
      lastname: joi.string().min(3).max(20).required(),
      email: joi
        .string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
          )
        )
        .required(),
    });

    const { error } = schema.validate({
      firstname,
      lastname,
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedTrainer = await updateTrainer({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      field,
      degree,
      trainer_id,
    });

    if (updatedTrainer) {
      return res.status(200).json(updatedTrainer);
    } else {
      return res.status(404).json({ error: "Trainer not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Update trainer failed" });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Extract user_id from the token
    const user_id = req.user.user_id;

    const recDeleted = await softDeleteUser(user_id);

    if (recDeleted) {
      return res
        .status(200)
        .json({ message: "User deleted successfully", user_id });
    } else {
      return res.status(404).json({ error: "User not found or not deleted" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Delete user failed" });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    // Extract trainer_id from the token
    const trainer_id = req.user.trainer_id;

    const recDeleted = await softDeleteTrainer(trainer_id);

    if (recDeleted) {
      return res
        .status(200)
        .json({ message: "Trainer deleted successfully", trainer_id });
    } else {
      return res
        .status(404)
        .json({ error: "Trainer not found or not deleted" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Delete trainer failed" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 2;

    const users = await getUsers(page, pageSize);
    res.status(200).json({
      message: "Users retrieved successfully",
      users,
    });
  } catch (error) {
    console.error("Failed to retrieve users: ", error);
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 2;

    const trainers = await getTrainers(page, pageSize);

    res.status(200).json({
      message: "Trainers retrieved successfully",
      trainers,
    });
  } catch (error) {
    console.error("Failed to retrieve trainers: ", error);
    return res.status(500).json({ error: "Failed to retrieve trainers" });
  }
};

module.exports = {
  userSignup,
  trainerSignup,
  loginUser,
  loginTrainer,
  updateUserHandler,
  updateTrainerHandler,
  deleteUser,
  deleteTrainer,
  getAllUsers,
  getAllTrainers,
};

// async function userSignup(req, res) {
//   const { firstname, lastname, email, password, role_id } = req.body;

//   try {
//     const schema = joi.object({
//       firstname: joi.string().alphanum().min(3).max(20).required(),
//       lastname: joi.string().min(3).max(20).required(),
//       email: joi
//         .string()
//         .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
//         .required(),
//       password: joi
//         .string()
//         .pattern(
//           new RegExp(
//             "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
//           )
//         )
//         .required(),
//     });

//     const validate = schema.validate({
//       firstname,
//       lastname,
//       email,
//       password,
//     });

//     if (validate.error) {
//       return res.status(405).json({ error: validate.error.details });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check if the user already exists
//     const existingUser = await db.users.findOne({
//       where: {
//         email: email,
//         is_deleted: false,
//       },
//     });

//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // Create a new user
//     const newUser = await db.users.create({
//       firstname: firstname,
//       lastname: lastname,
//       email: email,
//       password: hashedPassword,
//       role_id: role_id,
//     });

//     res.status(201).json({
//       message: "User added successfully",
//       user_id: newUser.user_id,
//     });
//   } catch (error) {
//     console.error("Failed to register : ", error);
//     res.status(500).json({ error: "Failed to register" });
//   }
// }

// async function trainerSignup(req, res) {
//   const { firstname, lastname, email, password, field, degree } = req.body;

//   try {
//     const schema = joi.object({
//       firstname: joi.string().alphanum().min(3).max(20).required(),
//       lastname: joi.string().min(3).max(20).required(),
//       email: joi
//         .string()
//         .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
//         .required(),
//       password: joi
//         .string()
//         .pattern(
//           new RegExp(
//             "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
//           )
//         )
//         .required(),
//     });

//     const validate = schema.validate({
//       firstname,
//       lastname,
//       email,
//       password,
//     });

//     if (validate.error) {
//       return res.status(405).json({ error: validate.error.details });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Check if the user already exists
//     const existingUser = await db.trainers.findOne({
//       where: {
//         email: email,
//         is_deleted: false,
//       },
//     });

//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // Create a new user
//     const newUser = await db.trainers.create({
//       firstname: firstname,
//       lastname: lastname,
//       email: email,
//       password: hashedPassword,
//       field: field,
//       degree: degree,
//     });

//     res.status(201).json({
//       message: "User added successfully",
//       trainer_id: newUser.trainer_id,
//     });
//   } catch (error) {
//     console.error("Failed to register : ", error);
//     res.status(500).json({ error: "Failed to register" });
//   }
// }

// async function loginUser(req, res) {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await db.users.findOne({
//       where: {
//         email: email,
//         is_deleted: false,
//       },
//     });

//     if (user) {
//       // Compare passwords
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         // Generate and return the JWT token
//         const token = jwt.sign(
//           {
//             user_id: user.user_id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//           },
//           process.env.SECRET_KEY,
//           {
//             expiresIn: "1h",
//           }
//         );
//         res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
//         res.json({
//           message: "Login successful",
//           user: {
//             user_id: user.user_id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//           },
//           token,
//         });
//       } else {
//         res.status(401).json({ error: "Invalid email or password" });
//       }
//     } else {
//       res.status(401).json({ error: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.error("Login failed: ", error);
//     res.status(500).json({ error: "Login failed" });
//   }
// }

// async function loginTrainer(req, res) {
//   const { email, password } = req.body;

//   try {
//     // Find the user by email
//     const user = await db.trainers.findOne({
//       where: {
//         email: email,
//         is_deleted: false,
//       },
//     });

//     if (user) {
//       // Compare passwords
//       const passwordMatch = await bcrypt.compare(password, user.password);

//       if (passwordMatch) {
//         // Generate and return the JWT token
//         const token = jwt.sign(
//           {
//             user_id: user.user_id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//           },
//           process.env.SECRET_KEY,
//           {
//             expiresIn: "1h",
//           }
//         );

//         res.json({
//           message: "Login successful",
//           user: {
//             user_id: user.user_id,
//             firstname: user.firstname,
//             lastname: user.lastname,
//           },
//           token,
//         });
//       } else {
//         res.status(401).json({ error: "Invalid email or password" });
//       }
//     } else {
//       res.status(401).json({ error: "Invalid email or password" });
//     }
//   } catch (error) {
//     console.error("Login failed: ", error);
//     res.status(500).json({ error: "Login failed" });
//   }
// }

// const updateUser = async (req, res) => {
//   const user_id = req.params.user_id;
//   const { firstname, lastname, email, password } = req.body;

//   try {
//     const schema = joi.object({
//       firstname: joi.string().alphanum().min(3).max(20).required(),
//       lastname: joi.string().min(3).max(20).required(),
//       email: joi
//         .string()
//         .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
//         .required(),
//       password: joi
//         .string()
//         .pattern(
//           new RegExp(
//             "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
//           )
//         )
//         .required(),
//     });

//     const { error } = schema.validate({
//       firstname,
//       lastname,
//       email,
//       password,
//     });

//     if (error) {
//       return res.status(400).json({ error: error.details });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//     const [recDeleted, updatedUser] = await db.users.update(
//       {
//         firstname,
//         lastname,
//         email,
//         password: hashedPassword,
//       },
//       {
//         where: {
//           user_id,
//           is_deleted: false,
//         },
//         returning: true, // To get the updated user details
//       }
//     );

//     if (recDeleted === 1) {
//       return res.status(200).json(updatedUser[0]);
//     } else {
//       return res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Update user failed" });
//   }
// };

// const updateTrainer = async (req, res) => {
//   const trainer_id = req.params.trainer_id;
//   const { firstname, lastname, email, password, field, degree } = req.body;

//   try {
//     const schema = joi.object({
//       firstname: joi.string().alphanum().min(3).max(20).required(),
//       lastname: joi.string().min(3).max(20).required(),
//       email: joi
//         .string()
//         .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
//         .required(),
//       password: joi
//         .string()
//         .pattern(
//           new RegExp(
//             "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{6,30}$"
//           )
//         )
//         .required(),
//     });

//     const { error } = schema.validate({
//       firstname,
//       lastname,
//       email,
//       password,
//     });

//     if (error) {
//       return res.status(400).json({ error: error.details });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//     const [recDeleted, updatedUser] = await db.trainers.update(
//       {
//         firstname,
//         lastname,
//         email,
//         password: hashedPassword,
//         field,
//         degree,
//       },
//       {
//         where: {
//           trainer_id,
//           is_deleted: false,
//         },
//         returning: true, // To get the updated user details
//       }
//     );

//     if (recDeleted === 1) {
//       return res.status(200).json(updatedUser[0]);
//     } else {
//       return res.status(404).json({ error: "User not found" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Update user failed" });
//   }
// };

// const deleteUser = async (req, res) => {
//   const user_id = req.params.user_id;

//   try {
//     const [recUpdated] = await db.users.update(
//       { is_deleted: true },
//       {
//         where: {
//           user_id,
//           is_deleted: false, // Ensure the user is not already soft-deleted
//         },
//       }
//     );

//     if (recUpdated === 1) {
//       return res.status(200).json({ message: "User deleted successfully" });
//     } else {
//       return res
//         .status(404)
//         .json({ error: "User not found or already been deleted" });
//     }
//   } catch (error) {
//     console.error(error); // Log the error
//     return res.status(500).json({ error: "Delete user failed" });
//   }
// };

// const deleteTrainer = async (req, res) => {
//   const trainer_id = req.params.trainer_id;

//   try {
//     const [numUpdated] = await db.trainers.update(
//       { is_deleted: true },
//       {
//         where: {
//           trainer_id,
//           is_deleted: false, // Ensure the trainer is not already soft-deleted
//         },
//       }
//     );

//     if (numUpdated === 1) {
//       return res.status(200).json({ message: "Trainer deleted successfully" });
//     } else {
//       return res
//         .status(404)
//         .json({ error: "Trainer not found or already been deleted" });
//     }
//   } catch (error) {
//     console.error(error); // Log the error
//     return res.status(500).json({ error: "Delete trainer failed" });
//   }
// };
