import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const loadCSV = (csvPath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const absolutePath = path.resolve(__dirname, '../../', csvPath);

    console.log(`Loading CSV from: ${absolutePath}`);

    fs.createReadStream(absolutePath)
      .pipe(csv())
      .on('data', (data) => {
        const record = {
          transactionId: parseInt(data['Transaction ID'] || data.transaction_id) || 0,
          
          // Customer Fields
          customerId: data['Customer ID'] || data.customer_id,
          customerName: data['Customer Name'] || data.customer_name,
          phoneNumber: data['Phone Number'] || data.phone_number,
          gender: data['Gender'] || data.gender,
          age: parseInt(data['Age'] || data.age) || 0,
          customerRegion: data['Customer Region'] || data.customer_region,
          customerType: data['Customer Type'] || data.customer_type,
          
          // Product Fields
          productId: data['Product ID'] || data.product_id,
          productName: data['Product Name'] || data.product_name,
          brand: data['Brand'] || data.brand,
          productCategory: data['Product Category'] || data.product_category,
          tags: data['Tags'] || data.tags,
          
          // Sales Fields
          quantity: parseInt(data['Quantity'] || data.quantity) || 0,
          pricePerUnit: parseFloat(data['Price per Unit'] || data.price_per_unit) || 0,
          discountPercentage: parseFloat(data['Discount Percentage'] || data.discount_percentage) || 0,
          totalAmount: parseFloat(data['Total Amount'] || data.total_amount) || 0,
          finalAmount: parseFloat(data['Final Amount'] || data.final_amount) || 0,
          
          // Operational Fields
          date: data['Date'] || data.date,
          paymentMethod: data['Payment Method'] || data.payment_method,
          orderStatus: data['Order Status'] || data.order_status,
          deliveryType: data['Delivery Type'] || data.delivery_type,
          storeId: data['Store ID'] || data.store_id,
          storeLocation: data['Store Location'] || data.store_location,
          salespersonId: data['Salesperson ID'] || data.salesperson_id,
          employeeName: data['Employee Name'] || data.employee_name
        };
        
        results.push(record);
      })
      .on('end', () => {
        console.log(`CSV loaded successfully: ${results.length} records`);
        resolve(results);
      })
      .on('error', (error) => {
        console.error('Error loading CSV:', error);
        reject(error);
      });
  });
};
