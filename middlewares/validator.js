import Joi from "@hapi/joi";

const httpSchemaValidation = (input, type) => {
  let schema;
  if (type === "login") {
    schema = Joi.object({
      email: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
    });
  } else if (type === "helper") {
    schema = Joi.object({
      email: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      phone: Joi.string().min(8).required(),
      birth_date: Joi.string().min(3).required(),
      acc_type: Joi.any().required(),
    });
  } else if (type === "client") {
    schema = Joi.object({
      email: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      birth_date: Joi.string().min(3).required(),
      address: Joi.string().required(),
      c_address: Joi.string(),
      city: Joi.string().required(),
      zipcode: Joi.string().required(),
      phone: Joi.string().min(7).required(),
      acc_type: Joi.any().required(),
      latitude: Joi.string(),
      longitude: Joi.string(),
    });
  } else if (type === "login") {
    schema = Joi.object({
      email: Joi.string().min(5).required(),
      password: Joi.string().min(5).required(),
      firstName: Joi.string().required(),
      adress: Joi.string().required(),
      city: Joi.string().required(),
      zipcode: Joi.string().required(),
      phone: Joi.string.min(7).required(),
    });
  } else if (type === "annonce") {
    schema = Joi.object({
      courses: Joi.array().required(),
      info_annexes: Joi.string().required(),
      payment_method: Joi.string().required(),
      max_price: Joi.string().required(),
      status: Joi.string().required(),
      created_by: Joi.any().required(),
      handled_by: Joi.any(),
    });
  }
  const validation = schema.validate(input);
  console.log(validation, input);
  return validation;
};

export default httpSchemaValidation;
