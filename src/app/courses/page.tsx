'use client';

import Link from 'next/link';

const courses = [
  {
    id: 1,
    title: 'Introduction to Blockchain',
    description: 'Learn the fundamentals of blockchain technology.',
    modules: [
      { id: 1, title: 'What is Blockchain?' },
      { id: 2, title: 'How Blockchain Works' },
      { id: 3, title: 'Types of Blockchains' },
    ],
  },
  {
    id: 2,
    title: 'Introduction to Cryptocurrency',
    description: 'Learn the basics of cryptocurrency.',
    modules: [
      { id: 1, title: 'What is Cryptocurrency?' },
      { id: 2, title: 'How to Buy Cryptocurrency' },
      { id: 3, title: 'How to Store Cryptocurrency' },
    ],
  },
  {
    id: 3,
    title: 'Introduction to DeFi',
    description: 'Learn the fundamentals of decentralized finance.',
    modules: [
      { id: 1, title: 'What is DeFi?' },
      { id: 2, title: 'How to Use DeFi' },
      { id: 3, title: 'The Future of DeFi' },
    ],
  },
];

export default function CoursesPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Courses</h1>
      <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <div className="p-4 border rounded cursor-pointer">
              <h2 className="text-xl font-bold">{course.title}</h2>
              <p>{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}