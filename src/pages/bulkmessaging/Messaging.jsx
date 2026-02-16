import React from "react";
import {
  MessageCircle,
  ChevronDown,
  Clock,
  Send,
} from "lucide-react";

const recentMessages = [
  {
    text: "New Education support program now available. Apply Today !",
    date: "20-05-2025",
    time: "10:00 Am",
    group: "Students",
  },
  {
    text: "New Education support program now available. Apply Today !",
    date: "20-05-2025",
    time: "10:00 Am",
    group: "Students",
  },
  {
    text: "New Education support program now available. Apply Today !",
    date: "20-05-2025",
    time: "10:00 Am",
    group: "Students",
  },
];

const Messaging = () => {
  return (
    <div className="bg-[#F3FFF7] p-6 rounded-2xl w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Bulk Messaging</h2>
        <p className="text-gray-500">
          Send Message to multiple users via whatsapp
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl p-4 flex items-center gap-4 border-l-4 border-green-500 w-full md:w-72 mb-6">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <MessageCircle className="text-green-600" size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Message Sent</p>
          <p className="text-xl font-bold">30</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Message */}
        <div className="bg-white rounded-2xl p-6 border">
          <h3 className="font-semibold text-lg mb-4">
            Compose Message
          </h3>

          {/* Target Group */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Target Group
            </label>
            <div className="mt-2 flex items-center justify-between bg-gray-100 px-4 py-3 rounded-lg cursor-pointer">
              <span className="text-sm text-gray-600">
                All Users
              </span>
              <ChevronDown size={18} />
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="text-sm font-medium">
              Message Content
            </label>
            <textarea
              placeholder="Type your message here......."
              className="mt-2 w-full h-40 bg-gray-100 rounded-lg p-4 text-sm outline-none resize-none"
            />
          </div>

          {/* Send Button */}
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
            <Send size={16} />
            Send Message
          </button>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl p-6 border">
          <h3 className="font-semibold text-lg mb-4">
            Recent Messages
          </h3>

          <div className="space-y-4">
            {recentMessages.map((msg, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 flex justify-between gap-4"
              >
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 mt-2"></span>
                    <p className="text-sm font-medium">
                      {msg.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <Clock size={14} />
                    {msg.date} &nbsp; {msg.time}
                  </div>
                </div>

                <span className="h-fit px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                  {msg.group}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Messaging
