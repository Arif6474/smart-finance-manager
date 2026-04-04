import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Goal from '@/models/Goal';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);
        const { name, targetAmount, currentAmount, deadline, color, icon } = await req.json();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (targetAmount !== undefined) updateData.targetAmount = Number(targetAmount);
        if (currentAmount !== undefined) updateData.currentAmount = Number(currentAmount);
        if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
        if (color !== undefined) updateData.color = color;
        if (icon !== undefined) updateData.icon = icon;

        const updatedGoal = await Goal.findOneAndUpdate(
            { _id: params.id, userId: decoded.userId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedGoal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json(updatedGoal);
    } catch (error: any) {
        console.error("Error updating goal:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await dbConnect();
        const token = cookies().get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded: any = verifyToken(token);

        const deletedGoal = await Goal.findOneAndDelete({ _id: params.id, userId: decoded.userId });

        if (!deletedGoal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Goal deleted successfully' });
    } catch (error: any) {
        console.error("Error deleting goal:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
