import {NavigationProps} from '@/interfaces/navigation';
import { NavigationProp as ReactNavigationProp } from '@react-navigation/native';


export interface Chats {
    navigation: ReactNavigationProp<any>;
    chat_id: string; 
    other_person_name: string;
    last_message?: string;
    image_url?: string;
}

export interface ChatMessages {
    chat_message: number
    chat_id: number;
    content: string;
    create_date: Date; 
    other_person_name: string;
    send_date: Date;
    sender_name: string;
    image_urls?: string[];
  }
  
export interface SugestionItemProps{
    navigation: ReactNavigationProp<any>;
    user_id: number
    other_person_name: string
    image_url?: string
    create_conversation: (user_id: number)=> void
}

export interface SugestionChat{
    user_id: number
    other_person_name: string
    image_url?: string
}

export interface ChatNameOtherPerson{
    other_user_name: string
}
