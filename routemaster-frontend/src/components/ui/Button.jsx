import React from 'react';
import classNames from 'classnames';

const Button = ({
                    children,
                    onClick,
                    type = 'button',
                    variant = 'default',
                    size = 'base',
                    disabled = false,
                    className = ''
                }) => {
    const baseStyle = 'rounded px-3 py-1.5 font-medium text-sm transition';
    const variants = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-100',
        destructive: 'bg-red-600 text-white hover:bg-red-700'
    };
    const sizes = {
        base: 'text-sm',
        sm: 'text-xs py-1 px-2',
        lg: 'text-base py-2 px-4'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classNames(baseStyle, variants[variant], sizes[size], className)}
        >
            {children}
        </button>
    );
};

export { Button };
