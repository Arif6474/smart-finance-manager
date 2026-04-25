'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Skeleton from '@/components/Skeleton';
import { Mail, Phone, CheckCircle2, Clock, Archive, Trash2, ExternalLink } from 'lucide-react';

interface ContactRequest {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: 'new' | 'read' | 'resolved';
    createdAt: string;
}

export default function AdminContactRequestsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'resolved'>('all');
    const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

    useEffect(() => {
        if (!loading) {
            if (!user || (user.level !== 'admin' && user.level !== 'superAdmin')) {
                router.push('/dashboard');
                toast.error('You do not have access to this page');
                return;
            }
            fetchContactRequests();
        }
    }, [user, loading, router, filter]);

    const fetchContactRequests = async () => {
        setIsLoading(true);
        try {
            const url = filter === 'all' ? '/api/contact' : `/api/contact?status=${filter}`;
            const response = await fetch(url);

            if (response.ok) {
                const data = await response.json();
                setContactRequests(data);
            } else {
                toast.error('Failed to fetch contact requests');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: 'new' | 'read' | 'resolved') => {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                const updated = await response.json();
                setContactRequests(prev =>
                    prev.map(req => (req._id === id ? updated : req))
                );
                if (selectedRequest?._id === id) {
                    setSelectedRequest({ ...selectedRequest, status: newStatus });
                }
                toast.success(`Marked as ${newStatus}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const deleteRequest = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this contact request?')) return;

        try {
            const response = await fetch(`/api/contact/${id}`, { method: 'DELETE' });

            if (response.ok) {
                setContactRequests(prev => prev.filter(req => req._id !== id));
                if (selectedRequest?._id === id) {
                    setSelectedRequest(null);
                }
                toast.success('Contact request deleted');
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    if (loading || !user) {
        return <Skeleton />;
    }

    const stats = {
        total: contactRequests.length,
        new: contactRequests.filter(r => r.status === 'new').length,
        read: contactRequests.filter(r => r.status === 'read').length,
        resolved: contactRequests.filter(r => r.status === 'resolved').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Contact Requests</h1>
                <p className="text-muted-foreground">Manage all customer contact requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">New</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.new}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Read</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.read}</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Resolved</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.resolved}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 border-b border-border">
                {(['all', 'new', 'read', 'resolved'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => {
                            setFilter(tab);
                            setSelectedRequest(null);
                        }}
                        className={`px-4 py-2 font-medium text-sm capitalize transition-colors ${
                            filter === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Requests List */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-card border border-border rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : contactRequests.length > 0 ? (
                        <div className="space-y-3">
                            {contactRequests.map(request => (
                                <button
                                    key={request._id}
                                    onClick={() => setSelectedRequest(request)}
                                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                                        selectedRequest?._id === request._id
                                            ? 'bg-primary/10 border-primary'
                                            : 'bg-card border-border hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-foreground truncate">{request.name}</p>
                                            <p className="text-sm text-muted-foreground truncate">{request.email}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                                {request.message}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex items-center gap-2">
                                            {request.status === 'new' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                                    <Clock size={12} />
                                                    New
                                                </span>
                                            )}
                                            {request.status === 'read' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                                                    <ExternalLink size={12} />
                                                    Read
                                                </span>
                                            )}
                                            {request.status === 'resolved' && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                                    <CheckCircle2 size={12} />
                                                    Resolved
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {new Date(request.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(request.createdAt).toLocaleTimeString()}
                                    </p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-card border border-border rounded-lg">
                            <p className="text-muted-foreground">No contact requests found</p>
                        </div>
                    )}
                </div>

                {/* Request Details */}
                {selectedRequest ? (
                    <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-4">
                        <h3 className="text-lg font-bold text-foreground mb-4">Request Details</h3>

                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Name</p>
                                <p className="text-foreground">{selectedRequest.name}</p>
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
                                    <Mail size={14} /> Email
                                </p>
                                <a
                                    href={`mailto:${selectedRequest.email}`}
                                    className="text-primary hover:underline break-all"
                                >
                                    {selectedRequest.email}
                                </a>
                            </div>

                            {/* Phone */}
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
                                    <Phone size={14} /> Phone
                                </p>
                                <a
                                    href={`tel:${selectedRequest.phone}`}
                                    className="text-primary hover:underline"
                                >
                                    {selectedRequest.phone}
                                </a>
                            </div>

                            {/* Date */}
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Date Received</p>
                                <p className="text-foreground text-sm">
                                    {new Date(selectedRequest.createdAt).toLocaleDateString()}{' '}
                                    {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                                </p>
                            </div>

                            {/* Message */}
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Message</p>
                                <p className="text-foreground text-sm whitespace-pre-wrap break-words">
                                    {selectedRequest.message}
                                </p>
                            </div>

                            {/* Status Buttons */}
                            <div className="pt-4 border-t border-border space-y-2">
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Change Status</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(selectedRequest._id, 'read')}
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                                            selectedRequest.status === 'read'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-background border border-border hover:border-blue-600 text-foreground'
                                        }`}
                                    >
                                        Read
                                    </button>
                                    <button
                                        onClick={() => updateStatus(selectedRequest._id, 'resolved')}
                                        className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                                            selectedRequest.status === 'resolved'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-background border border-border hover:border-green-600 text-foreground'
                                        }`}
                                    >
                                        Resolve
                                    </button>
                                </div>

                                {/* Delete Button */}
                                <button
                                    onClick={() => deleteRequest(selectedRequest._id)}
                                    className="w-full mt-4 px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
                                >
                                    <Trash2 size={16} />
                                    Delete Request
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-4 text-center text-muted-foreground">
                        <p>Select a request to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
