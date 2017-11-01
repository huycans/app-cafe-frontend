import {
    StyleSheet,
} from 'react-native';
import {baseFontSize} from '../../constants/constants';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    baseText: {
        textAlign: 'center',
        color: 'white',
        fontSize: baseFontSize
    },
    smallText: {
        textAlign: 'center',
        color: 'white',
        fontSize: baseFontSize - 4
    },
    button: {
        borderRadius: 6,
        margin: 5,
        padding: 5
    },
    input: {
        width: 250,
        alignItems: 'center',
        borderRadius: 4
    },
    signupInput: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: 'white'
    },
    error: {
        marginBottom: 5,
        textAlign: 'center',
        color: 'red',
        fontSize: baseFontSize + 10,
    }
});
export default styles;