import {
    View,
    Text,
    ActivityIndicator
} from 'react-native';

import React, { Component } from 'react';

const Loading = () =>
    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator visible ={true} textContent={"Loading..."} overlayColor={"white"} color={"black"} textStyle={{ color: "black" }} />
        <Text>Loading...</Text>
    </View>;

export default Loading;