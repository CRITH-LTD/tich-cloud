import React from 'react';

interface ShimmerLoaderProps {
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}

const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({
    width = '100%',
    height = '1rem',
    borderRadius = 4,
    className = '',
    style = {},
}) => {
    return (
        <div
            className={`shimmer ${className}`}
            style={{
                width,
                height,
                borderRadius,
                ...style,
            }}
        />
    );
};

export default ShimmerLoader;
