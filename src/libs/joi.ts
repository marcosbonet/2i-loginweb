import Joi from "@hapi/joi";

interface Idata {
  id: string;
  nickname: string;
  nombre: string;
  apellido: string;
  direccion: string;
  email: string;
  password: string;
}

export const signUpValidation = (data: Idata) => {
  const user = Joi.object({
    id: Joi.string(),
    nickname: Joi.string().min(4).max(30).required(),
    nombre: Joi.string().min(4).max(30).required(),
    apellido: Joi.string().min(4).max(30).required(),
    direccion: Joi.string().min(4).max(30).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  return user.validate(data);
};

export const signinValidation = (data: { email: string; password: string }) => {
  const user = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(3).required(),
  });
  return user.validate(data);
};
