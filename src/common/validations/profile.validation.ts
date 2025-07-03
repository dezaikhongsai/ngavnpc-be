import Joi from 'joi';

export const profileSchema = Joi.object({
    name : Joi.string().required().messages({
        'string.empty' : 'Tên là bắt buộc'
    }),
   dob: Joi.string()
  .pattern(/^([0-2][0-9]|(3)[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/)
  .messages({
    'string.pattern.base': 'Ngày sinh phải có định dạng dd/mm/yyyy',
  }),
    emailContact : Joi.string().email().messages({
        'string.email' : 'Email không hợp lệ'
    }),
    phoneContact : Joi.string().min(10).max(10).messages({
        'stirng.min' : 'Số điện thoại gồm 9 số',
        'string.max' : 'Số điện thoại gồm 9 số',
    })
})