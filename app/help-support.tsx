import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useToast } from '../contexts/ToastContext';
import { layout, spacing, surfaces, colors } from '@/styles/theme';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

const HelpSupportScreen = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: '1',
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "Order History" in your profile and clicking on the specific order. You\'ll receive tracking information via email once your order ships.',
      expanded: false,
    },
    {
      id: '2',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for unused items in original condition. Simply contact our support team to initiate a return and we\'ll provide you with a return shipping label.',
      expanded: false,
    },
    {
      id: '3',
      question: 'How long does shipping take?',
      answer: 'Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. Free shipping is available on orders over $50.',
      expanded: false,
    },
    {
      id: '4',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping times vary by location and typically take 7-14 business days.',
      expanded: false,
    },
    {
      id: '5',
      question: 'How can I change or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placement. After that, please contact our customer service team for assistance.',
      expanded: false,
    },
    {
      id: '6',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay.',
      expanded: false,
    },
  ]);

  const toggleFAQ = (id: string) => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id 
        ? { ...faq, expanded: !faq.expanded }
        : { ...faq, expanded: false }
    ));
  };

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    // In a real app, you would send this to your backend
    showToast("Message sent! We'll get back to you within 24 hours.", 'success');
    setContactForm({ name: '', email: '', subject: '', message: '' });
    setShowContactModal(false);
  };

  const handlePhoneCall = () => {
    Linking.openURL('tel:+1-555-123-4567');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@ecommerce.com');
  };

  const handleLiveChat = () => {
    showToast('Live chat will be available soon. Use email or phone support meantime.', 'info');
  };

  const renderContactModal = () => (
    <Modal
      visible={showContactModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: '#f8f9fa',
            borderBottomWidth: 1,
            borderBottomColor: '#e9ecef',
          }}
        >
          <TouchableOpacity onPress={() => setShowContactModal(false)}>
            <Text style={{ fontSize: 16, color: '#111' }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Contact Us</Text>
          <TouchableOpacity onPress={handleContactSubmit}>
            <Text style={{ fontSize: 16, color: '#111', fontWeight: '600' }}>Send</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Name *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={contactForm.name}
              onChangeText={(text) => setContactForm({ ...contactForm, name: text })}
              placeholder="Enter your name"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Email *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={contactForm.email}
              onChangeText={(text) => setContactForm({ ...contactForm, email: text })}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Subject *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
              }}
              value={contactForm.subject}
              onChangeText={(text) => setContactForm({ ...contactForm, subject: text })}
              placeholder="What's your question about?"
            />
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Message *</Text>
            <TextInput
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                borderWidth: 1,
                borderColor: '#e9ecef',
                minHeight: 120,
                textAlignVertical: 'top',
              }}
              value={contactForm.message}
              onChangeText={(text) => setContactForm({ ...contactForm, message: text })}
              placeholder="Please describe your issue or question..."
              multiline
              numberOfLines={6}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={layout.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: spacing.screenPadding,
          paddingVertical: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#000',
          }}
        >
          Help & Support
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.sectionSpacing * 4 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Options */}
        <View style={{ paddingHorizontal: spacing.screenPadding, paddingTop: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#000' }}>
            Get in Touch
          </Text>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
            <TouchableOpacity
              onPress={handlePhoneCall}
            style={[
              surfaces.card,
              {
                flex: 1,
                padding: 16,
                alignItems: 'center',
                marginRight: 8,
              },
            ]}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#e3f2fd',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Ionicons name="call" size={24} color="#2196f3" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'center' }}>
                Call Us
              </Text>
              <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2 }}>
                +1 (555) 123-4567
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEmail}
            style={[
              surfaces.card,
              {
                flex: 1,
                padding: 16,
                alignItems: 'center',
                marginHorizontal: 4,
              },
            ]}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#fff3e0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Ionicons name="mail" size={24} color="#ff9800" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'center' }}>
                Email Us
              </Text>
              <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2 }}>
                support@app.com
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowContactModal(true)}
            style={[
              surfaces.card,
              {
                flex: 1,
                padding: 16,
                alignItems: 'center',
                marginLeft: 8,
              },
            ]}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: '#e8f5e8',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Ionicons name="chatbubble" size={24} color="#4caf50" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', textAlign: 'center' }}>
                Contact Form
              </Text>
              <Text style={{ fontSize: 12, color: '#666', textAlign: 'center', marginTop: 2 }}>
                Send Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={{ paddingHorizontal: spacing.screenPadding }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#000' }}>
            Frequently Asked Questions
          </Text>
          
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              onPress={() => toggleFAQ(faq.id)}
              style={[
                surfaces.card,
                {
                  padding: 16,
                  marginBottom: 12,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', flex: 1, marginRight: 12 }}>
                  {faq.question}
                </Text>
                <Ionicons
                  name={faq.expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </View>
              
              {faq.expanded && (
                <Text
                  style={{
                    fontSize: 14,
                    color: '#666',
                    marginTop: 12,
                    lineHeight: 20,
                  }}
                >
                  {faq.answer}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: spacing.screenPadding, marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#000' }}>
            Quick Actions
          </Text>
          
          <TouchableOpacity
            onPress={() => router.push('/order-history')}
            style={[
              surfaces.card,
              {
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              },
            ]}
          >
            <Ionicons name="receipt" size={24} color="#111" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                View Order History
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                Track your orders and returns
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/shipping-address')}
            style={[
              surfaces.card,
              {
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              },
            ]}
          >
            <Ionicons name="location" size={24} color="#111" style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
                Manage Addresses
              </Text>
              <Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
                Update your shipping information
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderContactModal()}
    </SafeAreaView>
  );
};

export default HelpSupportScreen;