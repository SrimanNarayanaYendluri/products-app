import { Context } from "hono";
import argon2id from "argon2";

import { validateRequest } from "../validations/validationRequest";
import { ValidatedCreateUser } from "../validations/schemas/vCreateUserSchema";
import { USER_VALIDATION_ERROR, USER_REGISTRATION_SUCCESS, USER_NAME_EXISTS, USER_EMAIL_EXISTS } from "../constants/appMessages";
import { sendSuccessResponse } from "../utils/responseUtils";
import { saveSingleRecord } from "../services/db/baseDBService";
import { NewUser, User, users } from "../schemas/userSchema";
import ConflictException from "../exceptions/conflictException";

class UserController {

  registerUser = async (c: Context) => {
    try {
      const requestData = await c.req.json();

      const validatedUser = await validateRequest<ValidatedCreateUser>(
        'user:create-user',
        requestData,
        USER_VALIDATION_ERROR
      );

      const hashedPassword = await argon2id.hash(validatedUser.password);
      validatedUser.password = hashedPassword;

      const userData: NewUser = {
        ...validatedUser,
        password: hashedPassword,
      };

      const savedUser = await saveSingleRecord<User>(users, userData);

      const { password, ...userWithoutPassword } = savedUser;

      return sendSuccessResponse(c, 201, USER_REGISTRATION_SUCCESS, userWithoutPassword);

    } catch (error: any) {

      switch (error.constraint) {
        case 'users_user_name_unique':
          throw new ConflictException(USER_NAME_EXISTS);

        case 'users_email_unique':
          throw new ConflictException(USER_EMAIL_EXISTS);

        default:
          throw error;
      }
    }
  };

  
}

export default UserController;
