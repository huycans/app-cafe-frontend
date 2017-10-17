//https://github.com/sunnylqm/react-native-storage

import React, { Component } from 'react';
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

var storage = new Storage({
	// maximum capacity, default 1000 
	size: 1000,

	// Use AsyncStorage for RN, or window.localStorage for web.
	// If not set, data would be lost after reload.
	storageBackend: AsyncStorage,
	
	// expire time, default 1 day(1000 * 3600 * 24 milliseconds).
	// can be null, which means never expire.
	defaultExpires: 1000 * 3600 * 24,
	
	// cache data in the memory. default is true.
	enableCache: true,
	
	// if data was not found in storage or expired,
	// the corresponding sync method will be invoked and return 
	// the latest data.
	sync : {
		userId(){
            console.log('Data syncing Not yet implement');
        }
	}
})	;

function storeData(key, data, expires = 1000 * 3600 * 24) {
    try {
        console.log("Saving...", key);

        //persistent storage
        storage.save({
            key: key,
            data: data,
            expires: expires
        });
        console.log("Saved...", key);
    }
    catch (error) {
        console.log("Saving error: ", error);
    }
}
function removeData(key) {
    try {
        storage.remove({
            key: key
        });
        console.log('Removed ', key);
    }
    catch (error) {
        console.log('Removing error ', error);
    }

}
async function loadData(key) {
    console.log("Loading...");
    try {
        let result = await storage.load({
            key: key,
            // autoSync(default true) means if data not found or expired,
            // then invoke the corresponding sync method
            autoSync: true,

            // syncInBackground(default true) means if data expired,
            // return the outdated data first while invoke the sync method.
            // It can be set to false to always return data provided by sync method when expired.(Of course it's slower)
            syncInBackground: true,
        });
        return result;
    }
    catch (error) {
        console.log("Loading error", error);
    }
}

export {storeData, loadData, removeData} ;