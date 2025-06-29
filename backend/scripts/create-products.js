require('dotenv').config();
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const Product = require('../models/Product');

// ข้อมูลสินค้าตัวอย่าง
const Products = [
  {
    _id: uuidv4(),
    name: "อาหารสุนัขพรีเมี่ยม Royal Canin",
    price: 1299,
    originalPrice: 1499,
    rating: 4.8,
    reviews: 124,
    image: "/placeholder.svg?height=300&width=300",
    category: "อาหารสุนัข",
    brand: "Royal Canin",
    inStock: true,
    stock: 50,
    badge: "ขายดี",
    description: "อาหารสุนัขคุณภาพสูง เหมาะสำหรับสุนัขโตทุกสายพันธุ์",
  },
  {
    _id: uuidv4(),
    name: "ของเล่นแมวอินเตอร์แอคทีฟ",
    price: 599,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=300&width=300",
    category: "ของเล่นแมว",
    brand: "PetToy",
    inStock: true,
    stock: 20,
    badge: "ใหม่",
    description: "ของเล่นอัจฉริยะที่ช่วยกระตุ้นสมองแมว",
  },
  {
    _id: uuidv4(),
    name: "บ้านสุนัขกันน้ำ Premium",
    price: 2499,
    originalPrice: 2999,
    rating: 4.7,
    reviews: 67,
    image: "/placeholder.svg?height=300&width=300",
    category: "บ้านสัตว์",
    brand: "PetHouse",
    inStock: true,
    stock: 0,
    badge: "ลดราคา",
    description: "บ้านสุนัขกันน้ำ ทนทาน เหมาะสำหรับใช้กลางแจ้ง",
  },
  {
    _id: uuidv4(),
    name: "ปลอกคอแมวแฟชั่น",
    price: 299,
    rating: 4.6,
    reviews: 156,
    image: "/placeholder.svg?height=300&width=300",
    category: "อุปกรณ์แมว",
    brand: "CatStyle",
    inStock: true,
    stock: 10,
    description: "ปลอกคอแมวสไตล์เก๋ ปรับขนาดได้",
  },
  {
    _id: uuidv4(),
    name: "อาหารแมวเปียก Whiskas",
    price: 45,
    rating: 4.5,
    reviews: 203,
    image: "/placeholder.svg?height=300&width=300",
    category: "อาหารแมว",
    brand: "Whiskas",
    inStock: true,
    stock: 50,
    description: "อาหารแมวเปียกรสปลาทูน่า อร่อยและมีประโยชน์",
  },
  {
    _id: uuidv4(),
    name: "เสื้อผ้าสุนัขฤดูหนาว",
    price: 450,
    rating: 4.4,
    reviews: 78,
    image: "/placeholder.svg?height=300&width=300",
    category: "เสื้อผ้าสัตว์",
    brand: "PetFashion",
    inStock: false,
    stock: 5,
    description: "เสื้อกันหนาวสำหรับสุนัข อบอุ่นและสวยงาม",
  },
  {
    _id: uuidv4(),
    name: "ชามอาหารสแตนเลส",
    price: 199,
    rating: 4.7,
    reviews: 145,
    image: "/placeholder.svg?height=300&width=300",
    category: "อุปกรณ์ให้อาหาร",
    brand: "PetBowl",
    inStock: true,
    stock: 50,
    description: "ชามอาหารสแตนเลสคุณภาพสูง ทำความสะอาดง่าย",
  },
  {
    _id: uuidv4(),
    name: "ทรายแมวกลิ่นลาเวนเดอร์",
    price: 159,
    rating: 4.3,
    reviews: 92,
    image: "/placeholder.svg?height=300&width=300",
    category: "ทรายแมว",
    brand: "CatLitter",
    inStock: true,
    stock: 50,
    description: "ทรายแมวหอมกลิ่นลาเวนเดอร์ ดูดซับดีเยี่ยม",
  },
  {
    _id: uuidv4(),
    name: "เชือกจูงสุนัขแบบยืด",
    price: 350,
    rating: 4.6,
    reviews: 134,
    image: "/placeholder.svg?height=300&width=300",
    category: "อุปกรณ์สุนัข",
    brand: "DogWalk",
    inStock: true,
    stock: 50,
    badge: "แนะนำ",
    description: "เชือกจูงสุนัขแบบยืดหยุ่น ปลอดภัยและสะดวก",
  },
  {
    _id: uuidv4(),
    name: "ขนมสุนัขเสริมแคลเซียม",
    price: 129,
    rating: 4.8,
    reviews: 167,
    image: "/placeholder.svg?height=300&width=300",
    category: "ขนมสัตว์",
    brand: "HealthyTreat",
    inStock: true,
    stock: 5,
    description: "ขนมสุนัขเสริมแคลเซียม ช่วยเสริมสร้างกระดูกและฟัน",
  },
  {
    _id: uuidv4(),
    name: "กรงนกแก้วขนาดใหญ่",
    price: 1899,
    rating: 4.5,
    reviews: 43,
    image: "/placeholder.svg?height=300&width=300",
    category: "กรงสัตว์",
    brand: "BirdCage",
    inStock: true,
    stock: 5,
    description: "กรงนกแก้วขนาดใหญ่ แข็งแรงและปลอดภัย",
  },
  {
    _id: uuidv4(),
    name: "แชมพูสุนัขผิวแพ้งEasy",
    price: 249,
    rating: 4.7,
    reviews: 98,
    image: "/placeholder.svg?height=300&width=300",
    category: "ผลิตภัณฑ์อาบน้ำ",
    brand: "GentleCare",
    inStock: true,
    stock: 5,
    description: "แชมพูสำหรับสุนัขผิวแพ้ง่าย อ่อนโยนและปลอดภัย",
  },
];

// ฟังก์ชันสำหรับเพิ่มข้อมูลลงฐานข้อมูล
async function createProducts() {
  try {
    // ตรวจสอบว่า MONGODB_URI มีค่าหรือไม่
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // เชื่อมต่อกับ MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // ลบข้อมูลเก่าทั้งหมด
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // เพิ่มข้อมูลใหม่
    await Product.insertMany(Products);
    console.log('Products seeded successfully');

    // แสดงจำนวนสินค้าทั้งหมด
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);

  } catch (error) {
    console.error('Error seeding products:', error.message);
  } finally {
    // ปิดการเชื่อมต่อ
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// รันสคริปต์
if (require.main === module) {
  createProducts();
}

module.exports = createProducts;