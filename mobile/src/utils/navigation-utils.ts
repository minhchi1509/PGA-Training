import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

const navigate = <T>(routeName: string, params?: T) => {
  navigationRef.current?.navigate(routeName, params);
};

const reset = <T>(routeName: string, params?: T) => {
  navigationRef.current?.reset({
    index: 0,
    routes: [{ name: routeName, params: params ?? {} }],
  });
};

const goBack = () => navigationRef.current?.goBack();

const currentRoute = () => navigationRef.current?.getCurrentRoute();

const GlobalNavigation = { navigate, reset, goBack, currentRoute };

export default GlobalNavigation;
