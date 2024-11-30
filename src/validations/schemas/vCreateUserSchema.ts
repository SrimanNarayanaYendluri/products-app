import { object, pipe, string, nonEmpty, optional, InferOutput, minLength, regex, BaseSchema, union, literal } from "valibot";
import { USERNAME_REQUIRED, USERNAME_IS_STRING, EMAIL_REQUIRED, EMAIL_IS_STRING, PASSWORD_REQUIRED, PASSWORD_IS_STRING, FIRST_NAME_REQUIRED, FIRST_NAME_IS_STRING, LAST_NAME_REQUIRED, LAST_NAME_IS_STRING, ADDRESS_REQUIRED, ADDRESS_IS_STRING, PHONE_NUMBER_IS_STRING, PASSWORD_IS_SHORT, USER_TYPE_REQUIRED, PHONE_NUMBER_SHORT_LENGTH, USERNAME_MIN_LENGTH, USERNAME_SPECIAL_CHARACTERS_NOT_ALLOWED, INVALID_EMAIL_FORMAT, } from "../../constants/appMessages";

const specialCharRegex = /^[a-zA-Z0-9]*$/;

const emailRegex = /^(?!.*\.\.)([^\s@]+@[^\s@]+\.[^\s@]+)$/;

const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const allowedUserTypes = union([literal("admin"), literal("user")]);


export const VCreateUserSchema = object({
    user_name: pipe(
        string(USERNAME_IS_STRING),
        nonEmpty(USERNAME_REQUIRED),
        minLength(3, USERNAME_MIN_LENGTH), 
        regex(specialCharRegex, USERNAME_SPECIAL_CHARACTERS_NOT_ALLOWED) 
    ),
    email: pipe(
        string(EMAIL_IS_STRING),
        nonEmpty(EMAIL_REQUIRED),
        regex(emailRegex, INVALID_EMAIL_FORMAT)
    ),
    user_type: pipe(
        allowedUserTypes,
        nonEmpty(USER_TYPE_REQUIRED)
    ),
    password: pipe(
        string(PASSWORD_IS_STRING),
        nonEmpty(PASSWORD_REQUIRED),
        minLength(6, PASSWORD_IS_SHORT)
    ),
    first_name: pipe(
        string(FIRST_NAME_IS_STRING),
        nonEmpty(FIRST_NAME_REQUIRED)
    ),
    last_name: pipe(
        string(LAST_NAME_IS_STRING),
        nonEmpty(LAST_NAME_REQUIRED)
    ),
    address: pipe(
        string(ADDRESS_IS_STRING),
        nonEmpty(ADDRESS_REQUIRED)
    ),
    phone_number: optional(
        pipe(
            string(PHONE_NUMBER_IS_STRING),
            minLength(10, PHONE_NUMBER_SHORT_LENGTH),
            regex(phoneRegex, PHONE_NUMBER_IS_STRING)
        )
    ),
});

export type ValidatedCreateUser = InferOutput<typeof VCreateUserSchema>;
