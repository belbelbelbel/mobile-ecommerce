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
    text: 'We Provide The  Products From Great Brands',
    textColor: '#005b4f',
    backgroundColor: '#f2c3d9ff',
  },
  {
    id: 2,
    animation: require('../assets//animations/Lottie2.json'),
    text: 'You Will Be Able to Find A Wide Collecton Of Electronics From Top Brands',
    textColor: '#1e2169',
    backgroundColor: '#bcd9eaff',
  },
  {
    id: 3,
    animation: require('../assets//animations/Lottie3.json'),
    text: 'Get started with to hgetProducts From Great Brands',
    textColor: '#F15937',
    backgroundColor: '#2a2a23ff',
  },
];

export default data;