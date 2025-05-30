'use client'
import {Message} from '@/app/models/User';
import { AcceptMessageSchema } from '@/app/schemas/acceptMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {toast} from 'sonner'

const Dashboard = () => {
  const [messages,setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading , setISSwitchLoading] = useState(false);


  const handleDeleteMessage = (messageID :string)=>{
    setMessages(messages.filter((message)=>message._id !== messageID))
  }


  const {data:session} = useSession()

  const form = useForm({
    resolver:zodResolver(AcceptMessageSchema);
  })

  const {register,watch,setValue} = form
  const accpeptMessage = watch('acceptMessages')

  return (
    Dashboard
  )
}

export default Dashboard
