import {AnimationObject} from 'lottie-react-native';

export interface OnboardingData {
  id: number;
  animation: AnimationObject;
  text: string;
  textColor: string;
  backgroundColor: string;
}

const data: OnboardingData[] = [
  {
    id: 1,
    animation: require('../assets/animations/ecommerce.json'),
    text: 'Discover Premium Packs and Accessories.',
    textColor: '#111827',
    backgroundColor: '#e5e7eb', // soft gray to match app background
  },
  {
    id: 2,
    animation: require('../assets/animations/Lottie2.json'),
    text: 'Explore a wide range of products and brands.',
    textColor: '#111827',
    backgroundColor: '#fef3c7', // warm amber accent
  },
  {
    id: 3,
    animation: require('../assets/animations/Lottie3.json'),
    text: 'Shop with confidence and enjoy a seamless shopping experience.',
    textColor: '#111827',
    backgroundColor: '#dbeafe', // soft blue accent
  },
];

export default data;