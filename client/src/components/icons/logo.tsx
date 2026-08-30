import React from "react";
import { View } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

interface LogoProps extends SvgProps {
  size?: number;
  className?: string;
}

export default function Logo({ size = 104, className, ...props }: LogoProps) {
  return (
    <View
      className={`items-center justify-center rounded-3xl shadow-lg shadow-emerald-500/30 elevation-6 ${className || ""}`}
    >
      <Svg
        width={size}
        height={size}
        viewBox="0 0 108 104"
        fill="none"
        {...props}
      >
        <Path
          d="M83.6001 0C96.8549 0 107.6 10.7452 107.6 24V80C107.6 93.2548 96.8549 104 83.6001 104H27.6001C14.3453 104 3.6001 93.2548 3.6001 80V24C3.6001 10.7452 14.3453 6.44258e-08 27.6001 0H83.6001ZM22.3667 28.3838C19.7717 28.384 17.6753 30.4802 17.6753 33.0752C17.6753 51.2116 32.3808 65.9168 50.5171 65.917V89.376C50.5171 91.9711 52.6144 94.0674 55.2095 94.0674C57.8044 94.0672 59.9009 91.971 59.9009 89.376V61.2256C59.9009 43.0892 45.1954 28.384 27.0591 28.3838H22.3667ZM83.3599 19C71.0441 19 60.3112 25.7888 54.6958 35.8174C59.7832 41.3447 63.229 48.4111 64.27 56.2402C80.3392 54.1143 92.7427 40.347 92.7427 23.6914C92.7425 21.0965 90.6463 19 88.0513 19H83.3599Z"
          fill="#22C55E"
        />
      </Svg>
    </View>
  );
}
