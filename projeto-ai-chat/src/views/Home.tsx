import {
  Text,
  View,
  Button,
  Page,
  Chat,
  TextInput,
  Markdown,
} from "eitri-luminus";
import { useState, useEffect } from "react";
import Robot from "../assets/images/robot.png";
import { IoSend } from "react-icons/io5";

import { AgentRole, useAgent } from "eitri-agents";

export default function ChatPage(props) {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const agent = useAgent("SellerAgent", {
    verbose: true,
  });

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const askAgent = async (message: string) => {
    if (!message.trim()) {
      return;
    }

    const messagesToSend = {
      role: AgentRole.User,
      content: message,
    };

    setMessages((prevState) => [...prevState, messagesToSend]);

    setTimeout(scrollToBottom, 100);
    setValue("");
    setIsLoading(true);

    try {
      const response = await agent.call(messagesToSend);

      let newMessage = response.message;

      setMessages((prevState) => [
        ...prevState,
        { role: "assistant", content: newMessage },
      ]);

      setTimeout(scrollToBottom, 200);
    } catch (error) {
      console.error("Error asking Agent:", error);
      setTimeout(scrollToBottom, 200);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      askAgent(value);
    }
  };

  return (
    <Page
      className="w-full h-screen bg-white flex flex-col pt-4"
      statusBarTextColor="black"
    >
      <View className="w-full max-w-6xl mx-auto flex flex-col h-full pb-40">
        {/* Chat Area */}
        <View
          id="chat-container"
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        >
          {messages.length === 0 && (
            <View className="flex flex-col items-center justify-center h-full text-center px-4">
              <View className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <View className="flex flex-col items-center space-y-3">
                  <View className="relative">
                    <View className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <Text className="text-3xl">🤖</Text>
                    </View>
                    <View className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"></View>
                  </View>
                  <Text className="text-2xl font-bold text-slate-800">
                    Olá! Eu sou o Assistente de vendas da Blackskull
                  </Text>
                  <Text className="text-slate-600 text-base max-w-md">
                    Seu assistente de vendas inteligente. Como posso ajudá-lo
                    hoje?
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Chat>
            {messages.map((message, index) => (
              <View key={`message-${index}`} className="mb-3">
                {message.role === "user" ? (
                  <Chat.End>
                    <Chat.Bubble className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md max-w-lg border-0 rounded-2xl">
                      <Text className="text-white font-medium leading-relaxed">
                        {message.content}
                      </Text>
                    </Chat.Bubble>
                  </Chat.End>
                ) : (
                  <Chat.Start>
                    <View className="relative mr-2">
                      <Chat.Image
                        src={Robot}
                        alt="Assistente Avatar"
                        className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 p-1"
                      />
                      <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></View>
                    </View>

                    <Chat.Bubble className="bg-white text-slate-800 shadow-md max-w-lg border border-slate-200 rounded-2xl">
                      <Markdown
                        content={message?.content ?? ""}
                        className="text-slate-800 leading-relaxed"
                      />
                    </Chat.Bubble>
                  </Chat.Start>
                )}
              </View>
            ))}

            {isLoading && (
              <Chat.Start>
                <View className="relative mr-2">
                  <Chat.Image
                    src={Robot}
                    alt="Assistente Avatar"
                    className="w-10 h-10 rounded-full border-2 border-blue-500 shadow-md bg-gradient-to-br from-blue-500 to-indigo-600 p-1"
                  />
                  <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></View>
                </View>

                <Chat.Bubble className="bg-white text-slate-800 shadow-md max-w-lg border border-slate-200 rounded-2xl">
                  <View className="flex items-center space-x-2 py-1">
                    <Text className="text-slate-700 text-sm font-medium">
                      Pensando...
                    </Text>
                    <View className="flex space-x-1">
                      <View className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></View>
                      <View
                        className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></View>
                      <View
                        className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></View>
                    </View>
                  </View>
                </Chat.Bubble>
              </Chat.Start>
            )}
          </Chat>
        </View>

        {/* Input Area */}
        <View className="p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200/60 shadow-lg absolute bottom-14 w-full z-10">
          <View className="flex items-center space-x-3 max-w-4xl mx-auto">
            <View className="flex-1 relative">
              <TextInput
                className="w-full px-5 py-3 !bg-white border-2 border-slate-200 rounded-3xl text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm hover:shadow-md"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyUp={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isLoading}
              />
            </View>
            <Button
              onClick={() => askAgent(value)}
              className={`px-6 py-3 rounded-3xl font-semibold transition-all duration-200 shadow-lg ${
                !value.trim() || isLoading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-500 to-indigo-600 text-white hover:shadow-xl hover:scale-105 active:scale-95"
              }`}
              disabled={!value.trim() || isLoading}
            >
              {isLoading ? (
                <View className="flex items-center">
                  <View className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></View>
                </View>
              ) : (
                <View className="flex items-center">
                  <IoSend className="text-xl !text-black" />
                </View>
              )}
            </Button>
          </View>
        </View>
      </View>
    </Page>
  );
}
