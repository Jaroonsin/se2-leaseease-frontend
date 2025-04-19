'use client';
import ReviewDashboard from './review';
import Header from './header';
import { useState } from 'react';
import UserDashboard from './user';

export default function AdminDashboard() {
    const [isReview, setReview] = useState(true);
    return (
        <div className=" flex w-full flex-col items-center rounded-md">
            <Header setReview={setReview} />
            {isReview && <ReviewDashboard />}
            {!isReview && <UserDashboard />}
        </div>
    );
}
