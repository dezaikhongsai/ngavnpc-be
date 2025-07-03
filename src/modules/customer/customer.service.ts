import { ICustomer } from "../../common/types/customer.type";
import Customer from "./customer.model";
import ApiError from "../../common/utils/ApiError";
import xlsx from 'xlsx';

interface PaginatedCustomerResponse {
    customers: ICustomer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface CustomerFilter {
    page?: number;
    limit?: number;
    name?: string;
    month?: number;
    year?: number;
    isPriod?: boolean;
    yearOfBirth?: number;
    userId: string;
}

export const createCustomer = async (customerData: ICustomer): Promise<ICustomer> => {
    try {
        // Check if phone number already exists
        const existingCustomer = await Customer.findOne({ phoneNumber: customerData.phoneNumber });
        if (existingCustomer) {
            throw new ApiError(400, "Số điện thoại đã tồn tại");
        }
       const customer = await Customer.create(customerData);
        return customer;
    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
};

export const getCustomerByUserId = async (userId: string): Promise<ICustomer[]> => {
    try {
        const customers = await Customer.find({createdBy : userId});
        if(!customers) throw new ApiError(400, "Không tìm thấy khách hàng");
        return customers;
    } catch (error : any) {
        throw new ApiError(500, error.message);
    }
}

export const updateCustomer = async (customerId: string, customerData: ICustomer , userId: string): Promise<ICustomer> => {
    try {
        const validCustomer = await Customer.findOne({_id : customerId , createdBy : userId});
        if(!validCustomer) throw new ApiError(400, "Bạn không có quyền cập nhật thông tin khách hàng này");
        const customer = await Customer.findByIdAndUpdate(customerId, customerData, {new : true});
        if(!customer) throw new ApiError(400, "Không tìm thấy khách hàng");
        return customer;
    } catch (error : any) {
        throw new ApiError(500, error.message);
    }
}

export const deleteCustomer = async (customerId: string , userId: string): Promise<ICustomer> => {
    try {
        const validCustomer = await Customer.findOne({_id : customerId , createdBy : userId});
        if(!validCustomer) throw new ApiError(400, "Bạn không có quyền xóa khách hàng này");
        const customer = await Customer.findByIdAndDelete(customerId);
        if(!customer) throw new ApiError(400, "Không tìm thấy khách hàng");
        return customer;
    } catch (error : any) {
        throw new ApiError(500, error.message);
    }
}

export const importExcel = async (file: Express.Multer.File, userId: string): Promise<{ success: ICustomer[], failed: any[] }> => {
    try {
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        const results = {
            success: [] as ICustomer[],
            failed: [] as any[]
        };
        // Define field mapping
        const fieldMapping = {
            'Họ và tên': 'name',
            'Năm sinh': 'yearOfBirth',
            'Số điện thoại': 'phoneNumber',
            'Ghi chú': 'note',
            // 'Khách hàng định kỳ': 'isPriod'
        };

        for (const row of data as any[]) {
            try {
                // Convert Vietnamese field names to English
                const mappedRow: any = {};
                for (const [viKey, enKey] of Object.entries(fieldMapping)) {
                    if (row[viKey] !== undefined) {
                        mappedRow[enKey] = row[viKey];
                    } else if (row[enKey] !== undefined) {
                        // Support both Vietnamese and English field names
                        mappedRow[enKey] = row[enKey];
                    }
                }

                // Validate required fields
                if (!mappedRow.name || !mappedRow.yearOfBirth || !mappedRow.phoneNumber) {
                    results.failed.push({
                        data: row,
                        error: 'Thiếu thông tin bắt buộc (tên, năm sinh hoặc số điện thoại)'
                    });
                    continue;
                }

                // Check if phone number already exists
                const existingCustomer = await Customer.findOne({ phoneNumber: mappedRow.phoneNumber });
                if (existingCustomer) {
                    results.failed.push({
                        data: row,
                        error: 'Số điện thoại đã tồn tại'
                    });
                    continue;
                }

                // Create customer object
                const customerData: ICustomer = {
                    name: mappedRow.name,
                    yearOfBirth: parseInt(mappedRow.yearOfBirth),
                    phoneNumber: mappedRow.phoneNumber.toString(),
                    note: mappedRow.note || '',
                    isPriod: mappedRow.isPriod === 'true' || mappedRow.isPriod === true || false,
                    createdBy: userId,
                    updatedBy: userId
                };

                // Save customer
                const customer = await Customer.create(customerData);
                results.success.push(customer);
            } catch (error: any) {
                results.failed.push({
                    data: row,
                    error: error.message
                });
            }
        }

        return results;
    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
};

export const getPaginatedCustomers = async (filter: CustomerFilter): Promise<PaginatedCustomerResponse> => {
    try {
        const page = filter.page || 1;
        const limit = filter.limit || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query: any = { createdBy: filter.userId };

        // Add name search if provided
        if (filter.name) {
            query.name = { $regex: filter.name, $options: 'i' };
        }

        // Add isPriod filter if provided
        if (filter.isPriod !== undefined) {
            query.isPriod = filter.isPriod;
        }

        // Add yearOfBirth filter if provided
        if (filter.yearOfBirth) {
            query.yearOfBirth = filter.yearOfBirth;
        }

        // Add month and year filter if provided
        if (filter.month && filter.year) {
            const startDate = new Date(filter.year, filter.month - 1, 1);
            const endDate = new Date(filter.year, filter.month, 0);
            query.createdAt = {
                $gte: startDate,
                $lte: endDate
            };
        }

        // Get total count for pagination
        const total = await Customer.countDocuments(query);

        // Get paginated customers
        const customers = await Customer.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        return {
            customers,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    } catch (error: any) {
        throw new ApiError(500, error.message);
    }
};

export const updatePriodCustomer = async (customerId: string, isPriod: boolean, userId: string): Promise<ICustomer> => {
    try {
        const validCustomer = await Customer.findOne({_id : customerId , createdBy : userId});
        if(!validCustomer) throw new ApiError(400, "Bạn không có quyền cập nhật thông tin khách hàng này");
        const customer = await Customer.findByIdAndUpdate(customerId, {isPriod}, {new : true});
        if(!customer) throw new ApiError(400, "Không tìm thấy khách hàng");
        return customer;
    } catch (error : any) {
        throw new ApiError(500, error.message);
    }
}