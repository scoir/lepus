import React from 'react';
import { ImageProps } from 'react-native';
import {
    StyleType,
    TopNavigation,
    TopNavigationAction,
    TopNavigationActionElement,
    TopNavigationProps,
} from '@ui-kitten/components';
import { BackIcon, } from '../assets/icons';

export interface ToolbarProps extends TopNavigationProps {
    backIcon?: (style: StyleType) => React.ReactElement<ImageProps>;
    menuIcon?: (style: StyleType) => React.ReactElement<ImageProps>;
    onBackPress?: () => void;
}

export const Toolbar = (props: ToolbarProps): TopNavigationActionElement => {

    const { backIcon, menuIcon, onBackPress, ...topNavigationProps } = props;

    const renderBackAction = (): TopNavigationActionElement => (
        <TopNavigationAction
            icon={props.backIcon || BackIcon}
            onPress={onBackPress}
        />
    );

    return (
        <React.Fragment>
            <TopNavigation
                {...topNavigationProps}
                alignment='center'
                leftControl={onBackPress && renderBackAction()}
            />
        </React.Fragment>
    );
};
