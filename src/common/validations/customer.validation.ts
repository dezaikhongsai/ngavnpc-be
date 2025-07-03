import Joi from 'joi';

export const customerSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Tên khách hàng không được để trống',
        'any.required': 'Tên khách hàng là bắt buộc'
    }),
    yearOfBirth: Joi.number().integer().min(1900).max(new Date().getFullYear()).required().messages({
        'number.base': 'Năm sinh phải là số',
        'number.integer': 'Năm sinh phải là số nguyên',
        'number.min': 'Năm sinh không hợp lệ',
        'number.max': 'Năm sinh không được lớn hơn năm hiện tại',
        'any.required': 'Năm sinh là bắt buộc'
    }),
    phoneNumber: Joi.string().pattern(/^[0-9]{10,11}$/).required().messages({
        'string.pattern.base': 'Số điện thoại phải có 10 hoặc 11 chữ số',
        'any.required': 'Số điện thoại là bắt buộc'
    }),
    note: Joi.string().allow('').optional(),
    isPriod: Joi.boolean().default(false)
});