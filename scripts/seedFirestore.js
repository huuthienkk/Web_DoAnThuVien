const { db } = require('../config/firebase');

const books = [
  { title: 'Kiến trúc hiện đại', author: 'Nguyễn Văn An', status: 'Available', rating: 4.8, reviews: 120, isFeatured: true, category: 'Kiến trúc', cover: 'https://images.unsplash.com/photo-1511105612627-41a31d98943f?q=80&w=400' },
  { title: 'Tâm lý học hành vi', author: 'Trần Thị Bích', status: 'Borrowed', rating: 4.7, reviews: 92, isFeatured: true, category: 'Tâm lý', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400', id_code: 'LIB-7729-CS', borrowDate: '12/10/2023', dueDate: '24/10/2023', daysLeft: 12 },
  { title: 'Lịch sử Thế giới', author: 'Lê Minh Hòa', status: 'Available', rating: 4.9, reviews: 210, isFeatured: true, category: 'Lịch sử', cover: 'https://images.pxfuel.com/preview/216/327/554/book-library-old-literature-preview.jpg' },
  { title: 'Thiết kế đồ họa cơ bản', author: 'Phạm Hoàng Nam', status: 'Available', rating: 4.5, reviews: 45, isFeatured: true, category: 'Thiết kế', cover: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=400' },
  { title: 'Triết học phương Đông', author: 'Đặng Thu Thảo', status: 'Borrowed', rating: 5.0, reviews: 310, isFeatured: true, category: 'Triết học', cover: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?q=80&w=400', id_code: 'LIB-1014-BA', borrowDate: '01/10/2023', dueDate: '15/10/2023', daysOverdue: 2 }
];

const users = [
  { name: 'Lê Hoàng Nam', email: 'nam.lh@university.edu.vn', studentid: 'SV202401', dept: 'Kỹ thuật Phần mềm', role: 'user', status: 'Active', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100' },
  { name: 'Nguyễn Thu Thảo', email: 'thao.nt@university.edu.vn', studentid: 'SV202402', dept: 'Kinh tế Đối ngoại', role: 'user', status: 'Active', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100' },
  { name: 'Trần Minh Đức', email: 'duc.tm@university.edu.vn', studentid: 'SV202396', dept: 'Thiết kế Đồ họa', role: 'user', status: 'Locked', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100' }
];

const transactions = [
  { user: 'Nguyễn Linh', userId: 'SV200461', book: 'Cấu trúc dữ liệu và Giải thuật', date: '12/10/2023', status: 'Active', color: '#2ECC71' },
  { user: 'Trần Hùng', userId: 'SV201408', book: 'Lịch sử văn minh thế giới', date: '08/10/2023', status: 'Overdue', color: '#E74C3C' }
];

async function seed() {
  if (!db) return;
  console.log('🌱 Full Seeding to Firestore...');
  
  const bBooks = db.batch();
  const exsBooks = await db.collection('books').get();
  exsBooks.forEach(doc => bBooks.delete(doc.ref));
  await bBooks.commit();

  const bUsers = db.batch();
  const exsUsers = await db.collection('users').get();
  exsUsers.forEach(doc => bUsers.delete(doc.ref));
  await bUsers.commit();

  const bTrans = db.batch();
  const exsTrans = await db.collection('transactions').get();
  exsTrans.forEach(doc => bTrans.delete(doc.ref));
  await bTrans.commit();

  // Add Data
  const mainBatch = db.batch();
  books.forEach(b => mainBatch.set(db.collection('books').doc(), b));
  users.forEach(u => mainBatch.set(db.collection('users').doc(), u));
  transactions.forEach(t => mainBatch.set(db.collection('transactions').doc(), t));

  await mainBatch.commit();
  console.log('✅ Final Seeding Success!');
  process.exit();
}

seed();
