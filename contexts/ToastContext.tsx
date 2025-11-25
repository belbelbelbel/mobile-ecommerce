import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

type ToastType = 'info' | 'success' | 'error';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  hideToast: () => void;
}

interface ToastProviderProps {
  children: ReactNode;
}

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const backgroundColors: Record<ToastType, string> = {
  info: '#1f2937',
  success: '#16a34a',
  error: '#dc2626',
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
  });
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const hideToast = useCallback(() => {
    clearTimer();
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    });
  }, [opacity, translateY]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', durationMs = 2500) => {
      clearTimer();
      setToast({ visible: true, message, type });

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      hideTimeoutRef.current = setTimeout(() => {
        hideToast();
      }, durationMs);
    },
    [hideToast, opacity, translateY],
  );

  const contextValue = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toast.visible && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toastContainer,
            {
              backgroundColor: backgroundColors[toast.type],
              opacity,
              transform: [{ translateY }],
            },
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

