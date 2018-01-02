//@flow
import * as React from "react";
import { Text, StyleSheet, View } from "react-native";
// import { Col, Row, Grid } from "react-native-easy-grid";
import { Right, Thumbnail } from "native-base";
export default class PointsExchange extends React.Component<any, void> {
  render(): React.Node {
    const BoxContent = (): React.Node => {
      return (
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={{ flex: 1 }}>Phiếu giảm giá</Text>
          <Text style={{ flex: 3, fontSize: 50, fontWeight: "bold" }}>
            10 %
          </Text>
          <Text style={{ flex: 1, textAlign: "right" }}>25 points</Text>
        </View>
      );
    };
    return <Text>Points</Text>;
    // return (
    //   <Grid>
    //     <Row size={10}>
    //       <Right
    //         style={{
    //           marginRight: 10,
    //           flex: 1,
    //           flexDirection: "row",
    //           justifyContent: "flex-end"
    //         }}
    //       >
    //         <Text>Số điểm hiện tại: 30</Text>
    //         <Thumbnail
    //           style={{}}
    //           source={require("../../../img/yama.png")}
    //           small
    //         />
    //       </Right>
    //     </Row>
    //     <Row size={30}>
    //       <Col style={styles.col}>
    //         <BoxContent />
    //       </Col>
    //       <Col style={styles.col} />
    //     </Row>
    //     <Row size={30}>
    //       <Col style={styles.col} />
    //       <Col style={styles.col} />
    //     </Row>
    //     <Row size={30}>
    //       <Col style={styles.col} />
    //       <Col style={styles.col} />
    //     </Row>
    //   </Grid>
    // );
  }
}

const styles = StyleSheet.create({
  col: {
    borderWidth: 5,
    borderStyle: "solid",
    borderColor: "#FEEEB5"
  }
});
