export async function saveVideo(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PauseAppDB', 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['videos'], 'readwrite');
      const store = transaction.objectStore('videos');
      const putRequest = store.put(blob, 'pledgeVideo');

      putRequest.onsuccess = () => resolve('pledgeVideo');
      putRequest.onerror = () => reject('Failed to save video');
    };

    request.onerror = () => reject('Failed to open database');
  });
}

export async function getVideo(): Promise<Blob | null> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('PauseAppDB', 1);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('videos')) {
        db.createObjectStore('videos');
      }
    };

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['videos'], 'readonly');
      const store = transaction.objectStore('videos');
      const getRequest = store.get('pledgeVideo');

      getRequest.onsuccess = () => resolve(getRequest.result || null);
      getRequest.onerror = () => reject('Failed to get video');
    };

    request.onerror = () => reject('Failed to open database');
  });
}
