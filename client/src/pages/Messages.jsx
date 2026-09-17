import Navbar from "../components/Navbar";
import "../styles/Messages.css";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  sendMessage,
  getUserMessages,
  deleteMessage,
} from "../services/MessageService";

function Messages() {
  const location = useLocation();
  const messagesEndRef = useRef(null);

  const [allMessages, setAllMessages] = useState([]);
  const [activePartner, setActivePartner] = useState(
    location.state?.receiverEmail || ""
  );
  const [content, setContent] = useState(location.state?.prefillSubject || "");
  const [newRecipientInput, setNewRecipientInput] = useState("");
  const [showNewChatBox, setShowNewChatBox] = useState(false);
  const [loading, setLoading] = useState(true);

  const savedUserStr = localStorage.getItem("user");
  const user = savedUserStr ? JSON.parse(savedUserStr) : null;

  const loadMessages = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const response = await getUserMessages(user.email);
      const data = Array.isArray(response.data) ? response.data : [];
      setAllMessages(data);

      if (!activePartner && data.length > 0) {
        const firstMsg = data[data.length - 1];
        const partner =
          firstMsg.senderEmail.toLowerCase() === user.email.toLowerCase()
            ? firstMsg.receiverEmail
            : firstMsg.senderEmail;
        setActivePartner(partner);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (location.state?.receiverEmail) {
      setActivePartner(location.state.receiverEmail);
      if (location.state?.prefillSubject) {
        setContent(`Hello, I would like to inquire about: ${location.state.prefillSubject}`);
      }
    }
  }, [location.state]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages, activePartner]);

  // Group messages into distinct partners
  const partnersMap = new Map();
  if (user?.email) {
    allMessages.forEach((msg) => {
      const partner =
        msg.senderEmail.toLowerCase() === user.email.toLowerCase()
          ? msg.receiverEmail
          : msg.senderEmail;
      
      if (partner) {
        partnersMap.set(partner.toLowerCase(), {
          partnerEmail: partner,
          lastMessage: msg.content,
          timestamp: msg.createdAt,
        });
      }
    });
  }

  // Ensure current active partner is in the list even if no prior messages exist
  if (activePartner && !partnersMap.has(activePartner.toLowerCase())) {
    partnersMap.set(activePartner.toLowerCase(), {
      partnerEmail: activePartner,
      lastMessage: "New Conversation",
      timestamp: null,
    });
  }

  const partnersList = Array.from(partnersMap.values());

  const activeMessages = allMessages.filter(
    (msg) =>
      activePartner &&
      ((msg.senderEmail.toLowerCase() === user?.email.toLowerCase() &&
        msg.receiverEmail.toLowerCase() === activePartner.toLowerCase()) ||
        (msg.senderEmail.toLowerCase() === activePartner.toLowerCase() &&
          msg.receiverEmail.toLowerCase() === user?.email.toLowerCase()))
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!activePartner || !content.trim()) {
      return;
    }

    try {
      const messagePayload = {
        senderEmail: user.email,
        receiverEmail: activePartner.trim(),
        content: content.trim(),
      };

      const response = await sendMessage(messagePayload);
      setAllMessages((prev) => [...prev, response.data]);
      setContent("");
      setShowNewChatBox(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteMessage(msgId);
      setAllMessages((prev) => prev.filter((m) => m.id !== msgId));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleStartNewChat = (e) => {
    e.preventDefault();
    if (newRecipientInput.trim()) {
      setActivePartner(newRecipientInput.trim());
      setNewRecipientInput("");
      setShowNewChatBox(false);
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "Just now";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <>
      <Navbar />

      <main className="messages-page-wrapper animate-fade-in">
        <div className="messages-container-modern">
          {/* Sidebar */}
          <aside className="inbox-sidebar">
            <div className="inbox-sidebar-header">
              <h2>Conversations</h2>
              <button
                type="button"
                className="btn-new-chat"
                onClick={() => setShowNewChatBox(!showNewChatBox)}
              >
                {showNewChatBox ? "Cancel" : "+ New"}
              </button>
            </div>

            {showNewChatBox && (
              <form className="new-chat-dialog" onSubmit={handleStartNewChat}>
                <input
                  type="email"
                  placeholder="Enter email to message..."
                  className="compose-input"
                  value={newRecipientInput}
                  onChange={(e) => setNewRecipientInput(e.target.value)}
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="btn-sm-primary"
                  style={{ marginTop: "8px", width: "100%" }}
                >
                  Start Conversation
                </button>
              </form>
            )}

            <div className="threads-list">
              {loading ? (
                <p style={{ padding: "20px", color: "var(--text-dim)", textAlign: "center" }}>
                  Loading chats...
                </p>
              ) : partnersList.length === 0 ? (
                <div style={{ padding: "30px 16px", textAlign: "center", color: "var(--text-dim)" }}>
                  <p>No conversations yet.</p>
                  <p style={{ fontSize: "12px", marginTop: "4px" }}>Click "+ New" to reach out.</p>
                </div>
              ) : (
                partnersList.map((thread) => {
                  const isActive =
                    activePartner &&
                    activePartner.toLowerCase() === thread.partnerEmail.toLowerCase();

                  return (
                    <div
                      key={thread.partnerEmail}
                      className={`thread-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setActivePartner(thread.partnerEmail);
                        setShowNewChatBox(false);
                      }}
                    >
                      <div className="thread-avatar">
                        {thread.partnerEmail.charAt(0).toUpperCase()}
                      </div>
                      <div className="thread-info">
                        <div className="thread-contact">{thread.partnerEmail}</div>
                        <div className="thread-preview">{thread.lastMessage}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>

          {/* Active Chat Area */}
          <section className="chat-main">
            {activePartner ? (
              <>
                <header className="chat-header">
                  <div className="thread-avatar" style={{ width: "36px", height: "36px", fontSize: "14px" }}>
                    {activePartner.charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-header-info">
                    <h3>{activePartner}</h3>
                    <small>Direct Deal Discussion</small>
                  </div>
                </header>

                <div className="messages-stream">
                  {activeMessages.length === 0 ? (
                    <div style={{ margin: "auto", textAlign: "center", color: "var(--text-dim)" }}>
                      <p>Start your conversation with <strong>{activePartner}</strong></p>
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMe =
                        msg.senderEmail.toLowerCase() === user?.email.toLowerCase();

                      return (
                        <div
                          key={msg.id}
                          className={`message-bubble-wrapper ${isMe ? "sent" : "received"}`}
                        >
                          <div className="message-bubble">{msg.content}</div>
                          <div className="message-meta">
                            <span>{formatTime(msg.createdAt)}</span>
                            {isMe && (
                              <button
                                type="button"
                                className="btn-msg-delete"
                                onClick={() => handleDeleteMessage(msg.id)}
                                title="Delete"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form className="chat-compose-bar" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    className="compose-input"
                    placeholder={`Message ${activePartner}...`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-send">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div style={{ margin: "auto", textAlign: "center", color: "var(--text-dim)", padding: "40px" }}>
                <h2>Your Communication Hub</h2>
                <p style={{ marginTop: "8px" }}>Select a conversation from the left or initiate a new chat.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export default Messages;