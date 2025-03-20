import React, { useEffect, useState } from 'react'
import { View, Text, Image, ImageBackground } from 'react-native'
import { heightToDp as hp, widthToDp as wp } from '../utilities/responsive'
import { PrimaryColor, QuaternaryFont, QuinaryFont, SecondaryColor } from '../utilities/constant'
import { StackActions } from '@react-navigation/native';
import AnimatedLoader from "react-native-animated-loader";

const Splash = (props) => {

    const [isLogging, setIsLogging] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            props.navigation.dispatch(StackActions.replace('Home'));
        }, 3000);

        return () => clearTimeout(timer); // Cleanup timeout on unmount
    }, [props.navigation]);

    return(
        <ImageBackground source={require('../images/splash.jpg')} resizeMode='cover' style={{ flex: 1, alignItems:'center',justifyContent:'center' }}>
            <View style={{ height:hp(70), alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color:PrimaryColor,fontSize:hp(2.3),fontWeight:'bold',marginBottom:hp(25)}}>Your daily weather companion</Text>
            </View>
            <View style={{ height:hp(20), alignItems: 'center', justifyContent: 'center' }}>
                {isLogging && (
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <AnimatedLoader
                            visible={true}
                            overlayColor="transparent"
                            source={require('../utilities/loader.json')}
                            animationStyle={{ width: hp(15), height: hp(15),marginTop:hp(55) }}
                            speed={1}
                        />
                        <Text style={{  fontSize: wp(4.5), color: PrimaryColor,fontWeight:'bold',marginBottom:hp(5) }}>Preparing Your Weather Report...</Text>
                    </View>
                )}
            </View>
        </ImageBackground>
    )
}

export default Splash