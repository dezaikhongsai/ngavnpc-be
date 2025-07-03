import { Request, Response, NextFunction } from 'express';
import { createCustomer , deleteCustomer, getCustomerByUserId, updateCustomer, getPaginatedCustomers, updatePriodCustomer } from './customer.service';
import { ICustomer } from '../../common/types/customer.type';
import ApiError from '../../common/utils/ApiError';
import { ApiResponse } from '../../common/types/api.type';
import * as customerService from "./customer.service";

export const createCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.body đã được validate bởi middleware
        console.log("req.body", req.body);
        console.log("req.user", req.user?._id);
        const {name , yearOfBirth , phoneNumber , note , isPriod} = req.body;
        const customerData: ICustomer = {
            name , yearOfBirth , phoneNumber , note , isPriod , createdBy : req.user?._id , updatedBy : req.user?._id
        };

        const customer = await createCustomer(customerData);
        
        const response: ApiResponse<typeof customer> = {
            status: 'success',
            message: 'Tạo thông tin khách hàng thành công!',
            data: customer
        };
        
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}; 

export const getCustomerByUserIdController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?._id?.toString();
        console.log("userId", userId);
        if(!userId) throw new ApiError(400, "Không tìm thấy người dùng");
        const customers = await getCustomerByUserId(userId);
        const response: ApiResponse<typeof customers> = {
            status: 'success',
            message: 'Lấy danh sách khách hàng thành công!',
            data: customers
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

export const updateCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {customerId} = req.params;
        const {name , yearOfBirth , phoneNumber , note } = req.body;
        const userId = req.user?._id?.toString();
        if(!userId) throw new ApiError(400, "Không tìm thấy người dùng");
        const customerData: ICustomer = {name , yearOfBirth , phoneNumber , note  , updatedBy : userId};
        const customer = await updateCustomer(customerId, customerData , userId);
        const response: ApiResponse<typeof customer> = {
            status: 'success',
            message: 'Cập nhật thông tin khách hàng thành công!',
            data: customer
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}
export const deleteCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {customerId} = req.params;
        const userId = req.user?._id?.toString();
        if(!userId) throw new ApiError(400, "Không tìm thấy người dùng");
        const customer = await deleteCustomer(customerId, userId);
        const response: ApiResponse<typeof customer> = {
            status: 'success',
            message: 'Xóa khách hàng thành công!',
            data: customer
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

export const importExcel = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new ApiError(400, 'Vui lòng tải lên file Excel');
        }

        const userId = req.user?._id?.toString();
        if(!userId) throw new ApiError(400, "Không tìm thấy người dùng");
        const results = await customerService.importExcel(req.file, userId);

        res.status(200).json({
            success: true,
            message: `Import thành công ${results.success.length} khách hàng, thất bại ${results.failed.length} khách hàng`,
            data: {
                successCount: results.success.length,
                failedCount: results.failed.length,
                successRecords: results.success,
                failedRecords: results.failed
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getPaginatedCustomersHandler = async (req: Request, res: Response , next: NextFunction) => {
    try {
        const userId = req.user?._id;
        if (!userId) throw new Error("User not found");

        const filter = {
            userId,
            page: req.query.page ? parseInt(req.query.page as string) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
            name: req.query.name as string,
            month: req.query.month ? parseInt(req.query.month as string) : undefined,
            year: req.query.year ? parseInt(req.query.year as string) : undefined,
            yearOfBirth: req.query.yearOfBirth ? parseInt(req.query.yearOfBirth as string) : undefined,
            isPriod: req.query.isPriod ? req.query.isPriod === 'true' : undefined
        };

        const result = await getPaginatedCustomers(filter);
        const response: ApiResponse<typeof result> = {
            status: 'success',
            message: 'Lấy danh sách khách hàng thành công!',
            data: result
        };
        res.status(200).json(response);
    } catch (error: any) {
        next(error);
    }
};

export const updatePriodCustomerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {customerId} = req.params;
        const {isPriod} = req.body;
        const userId = req.user?._id?.toString();
        if(!userId) throw new ApiError(400, "Không tìm thấy người dùng");
        const customer = await updatePriodCustomer(customerId, isPriod, userId);
        const response: ApiResponse<typeof customer> = {
            status: 'success',
            message: 'Cập nhật thông tin khách hàng thành công!',
            data: customer
        };
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}