
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { User, LearningItem } from '@/types';

export const dataService = {
  // --- User Management ---
  getAllUsers: async (): Promise<User[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (e) {
      console.error("Error fetching users:", e);
      return [];
    }
  },

  updateUser: async (userId: string, data: Partial<User>) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
    } catch (e) {
      console.error("Error updating user:", e);
    }
  },

  deleteUser: async (userId: string) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.error("Error deleting user:", e);
    }
  },

  // --- Content Management ---
  getAllContent: async (type?: string): Promise<LearningItem[]> => {
    try {
      const contentRef = collection(db, 'content');
      let q = query(contentRef);
      if (type) {
        q = query(contentRef, where('type', '==', type));
      }
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LearningItem));
    } catch (e) {
      console.error("Error fetching content:", e);
      return [];
    }
  },

  addContent: async (item: Omit<LearningItem, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'content'), item);
      return docRef.id;
    } catch (e) {
      console.error("Error adding content:", e);
      return null;
    }
  },

  updateContent: async (itemId: string, data: Partial<LearningItem>) => {
    try {
      const contentRef = doc(db, 'content', itemId);
      await updateDoc(contentRef, data);
    } catch (e) {
      console.error("Error updating content:", e);
    }
  },

  deleteContent: async (itemId: string) => {
    try {
      await deleteDoc(doc(db, 'content', itemId));
    } catch (e) {
      console.error("Error deleting content:", e);
    }
  },

  // --- Admin Analytics ---
  getAdminStats: async () => {
    // In a real app, these would be calculated on the server or via Firestore aggregations
    return {
      totalUsers: 1240,
      activeUsers: 856,
      newSignups: 42,
      revenue: "$12,450",
      avgSession: "18m 42s",
      retention: "68%"
    };
  },

  getRecentActivity: async () => {
    return [
      { id: '1', user: 'Tanaka-san', action: 'Completed N5 Kanji Quiz', time: '2m ago', status: 'success' },
      { id: '2', user: 'Sato-kun', action: 'Upgraded to Premium', time: '15m ago', status: 'success' },
      { id: '3', user: 'Suzuki-san', action: 'Failed Login Attempt', time: '45m ago', status: 'warning' },
      { id: '4', user: 'Ito-chan', action: 'Reported a bug in "Typing Ninja"', time: '1h ago', status: 'error' },
      { id: '5', user: 'Watanabe-san', action: 'Reached Level 15', time: '3h ago', status: 'success' }
    ];
  },

  getUserGrowthStats: async () => {
    return [
      { name: 'Jan', users: 400 },
      { name: 'Feb', users: 600 },
      { name: 'Mar', users: 800 },
      { name: 'Apr', users: 1000 },
      { name: 'May', users: 1240 }
    ];
  }
};
