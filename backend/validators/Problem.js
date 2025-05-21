const Joi = require('joi');

/**
 * Validates problem input data
 * @param {Object} data - Problem data to validate
 * @param {boolean} isUpdate - Whether validating for update
 * @returns {Object} { isValid: boolean, errors?: Object, validatedData?: Object }
 */
const validateProblemInput = (data, isUpdate = false) => {
  const testCaseSchema = Joi.object({
    input: Joi.string().required().trim().min(1)
      .message('Test case input cannot be empty'),
    output: Joi.string().required().trim().min(1)
      .message('Test case output cannot be empty'),
    explanation: Joi.string().trim().allow('').optional(),
    isPublic: Joi.boolean().default(false)
  });

  const problemSchema = Joi.object({
    title: Joi.string().required().trim().min(5).max(100)
      .message('Title must be 5-100 characters'),
    description: Joi.string().required().min(20)
      .message('Description must be at least 20 characters'),
    difficulty: Joi.string().valid('easy', 'medium', 'hard').required(),
    tags: Joi.array().items(
      Joi.string().trim().min(2).max(20)
        .message('Each tag must be 2-20 characters')
    ).min(1).required()
      .message('At least one tag is required'),
    timeLimit: Joi.number().min(0.1).max(10).required()
      .message('Time limit must be 0.1-10 seconds'),
    memoryLimit: Joi.number().min(1).max(512).required()
      .message('Memory limit must be 1-512 MB'),
    inputFormat: Joi.string().required().min(10)
      .message('Input format must be at least 10 characters'),
    outputFormat: Joi.string().required().min(10)
      .message('Output format must be at least 10 characters'),
    sampleInput: Joi.string().required().trim().min(1),
    sampleOutput: Joi.string().required().trim().min(1),
    sampleExplanation: Joi.string().trim().allow('').optional(),
    constraints: Joi.string().required().min(10)
      .message('Constraints must be at least 10 characters'),
    solution: Joi.string().required().custom((value, helpers) => {
      if (value.trim().length < 10) {
        return helpers.message('Solution must be meaningful (at least 10 non-whitespace characters)');
      }
      return value;
    }),
    solutionExplanation: Joi.string().required().min(20)
      .message('Solution explanation must be at least 20 characters'),
    testCases: Joi.array().items(testCaseSchema).min(1).required()
      .message('At least one test case is required'),
    isPublished: Joi.boolean().default(false)
  });

  const schema = isUpdate
    ? problemSchema.fork(Object.keys(problemSchema.describe().keys), field => field.optional())
    : problemSchema;

  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false
  });

  if (error) {
    const errors = error.details.reduce((acc, curr) => {
      const key = curr.path.join('.');
      acc[key] = curr.message.replace(/["]/g, '');
      return acc;
    }, {});
    return { isValid: false, errors };
  }

  return { isValid: true, validatedData: value };
};

module.exports = { validateProblemInput };