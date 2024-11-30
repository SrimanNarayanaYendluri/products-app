import { flatten, safeParseAsync } from "valibot";
import { AppActivity, ValidatedRequest } from "../types/app.types";
import UnprocessableContentException from "../exceptions/unprocessableContentException";
import { VCreateProductSchema } from "../validations/schemas/vCreateProductSchema";
import { VCreateUserSchema } from "../validations/schemas/vCreateUserSchema";

export const validateRequest = async<R extends ValidatedRequest>(actionType: AppActivity, reqData: any, errorMessage: string) => {
    let schema;

    switch (actionType) {
        case "user:create-user":
            schema = VCreateUserSchema;
            break;
        case "product:create-product":
            schema = VCreateProductSchema;
            break;      
        
    }

    const validation = await safeParseAsync(schema!, reqData, {
        abortPipeEarly: true,
    });

    if (!validation.success) {
        throw new UnprocessableContentException(errorMessage, flatten(validation.issues).nested);
    }

    return validation.output as R;
};
