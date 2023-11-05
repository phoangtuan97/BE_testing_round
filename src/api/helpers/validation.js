const Joi = require('joi');

const schemaSignUp = Joi.object({
    firstName: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z ]{2,32}$/)
        .required(),
    lastName: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z ]{2,32}$/)
        .required(),
    email: Joi.string()
        .trim()
        .lowercase()
        .min(5)
        .max(64)
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .required(),
});

const schemaSignIn = Joi.object({
    email: Joi.string()
        .trim()
        .min(5)
        .max(64)
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    password: Joi.string()
        .min(8)
        .max(20)
        .required(),
});

module.exports = { schemaSignUp, schemaSignIn };
