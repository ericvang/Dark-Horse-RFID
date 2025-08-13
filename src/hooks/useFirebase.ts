import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp,
  enableNetwork,
  disableNetwork,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Item, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Convert Firestore data to app types
const convertFirestoreItem = (doc: any): Item => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    rfid: data.rfid,
    category: data.category,
    isEssential: data.isEssential,
    status: data.status,
    lastSeen: data.lastSeen?.toDate?.()?.toISOString() || data.lastSeen,
    location: data.location,
    image: data.image,
  };
};

// Convert app data to Firestore format
const convertToFirestore = (item: Partial<Item>) => {
  const firestoreData: any = { ...item };
  if (firestoreData.lastSeen && typeof firestoreData.lastSeen === 'string') {
    firestoreData.lastSeen = Timestamp.fromDate(new Date(firestoreData.lastSeen));
  }
  return firestoreData;
};

export const useFirebaseItems = (userId?: string) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Debug logging
  console.log('useFirebaseItems - userId param:', userId);

  // Real-time listener for items
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const itemsRef = collection(db, 'items');
    
           try {
         // Temporarily disable ordering while index builds
         const q = query(
           itemsRef,
           where('userId', '==', userId)
           // orderBy('lastSeen', 'desc') // Temporarily disabled
         );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const itemsData = snapshot.docs.map(convertFirestoreItem);
          setItems(itemsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error with ordered query:', err);
          // Fallback to simple query without ordering
          const simpleQuery = query(
            itemsRef,
            where('userId', '==', userId)
          );
          
          const fallbackUnsubscribe = onSnapshot(
            simpleQuery,
            (snapshot) => {
              const itemsData = snapshot.docs.map(convertFirestoreItem);
              setItems(itemsData);
              setLoading(false);
              setError(null);
            },
            (fallbackErr) => {
              console.error('Error with fallback query:', fallbackErr);
              setError('Failed to fetch items');
              setLoading(false);
            }
          );
          
          return fallbackUnsubscribe;
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up query:', err);
      setError('Failed to fetch items');
      setLoading(false);
      return () => {};
    }
  }, [userId]);

  // Add new item
  const addItem = async (itemData: Omit<Item, 'id'>) => {
    try {
      const firestoreData = convertToFirestore({
        ...itemData,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      const docRef = await addDoc(collection(db, 'items'), firestoreData);
      return docRef.id;
    } catch (err) {
      console.error('Error adding item:', err);
      throw new Error('Failed to add item');
    }
  };

  // Update item
  const updateItem = async (itemId: string, updates: Partial<Item>) => {
    try {
      const itemRef = doc(db, 'items', itemId);
      const firestoreData = convertToFirestore({
        ...updates,
        updatedAt: Timestamp.now(),
      });

      await updateDoc(itemRef, firestoreData);
    } catch (err) {
      console.error('Error updating item:', err);
      throw new Error('Failed to update item');
    }
  };

  // Delete item
  const deleteItem = async (itemId: string) => {
    try {
      const itemRef = doc(db, 'items', itemId);
      await deleteDoc(itemRef);
    } catch (err) {
      console.error('Error deleting item:', err);
      throw new Error('Failed to delete item');
    }
  };

  // Update RFID status (for real-time RFID updates)
  const updateRFIDStatus = async (rfid: string, status: 'detected' | 'missing', location?: string) => {
    try {
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, where('rfid', '==', rfid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const itemDoc = snapshot.docs[0];
        await updateDoc(itemDoc.ref, {
          status,
          lastSeen: Timestamp.now(),
          location: location || null,
          updatedAt: Timestamp.now(),
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating RFID status:', err);
      throw new Error('Failed to update RFID status');
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    updateRFIDStatus,
  };
};



// Network status hook for offline detection
export const useFirebaseNetwork = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      enableNetwork(db);
    };

    const handleOffline = () => {
      setIsOnline(false);
      disableNetwork(db);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline };
};