"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, Sparkles, Bot, Code, Zap, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      alert("Please upload a ZIP file containing your Google ADK agent folder.");
      return;
    }

    // Immediately redirect to train page
    window.location.href = '/train';
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.zip')) {
        if (fileInputRef.current) {
          fileInputRef.current.files = files;
          handleFileUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
        }
      } else {
        alert("Please upload a ZIP file containing your Google ADK agent folder.");
      }
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10">
        {/* Header */}
        <header className="relative">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm border-b border-border" />
          <div className="relative max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  VibePrompting
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={openFileDialog}
                className="flex items-center space-x-2 hover:bg-accent/50"
              >
                <span>Upload Agent</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-accent/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  AI-Powered Agent Enhancement
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  Transform Your
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Google ADK Agents
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Enhance your AI agents with optimized meta prompting infrastructure, featuring AI-generated prompting, validated with state-of-the-art evals and dynamic git-like version control.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={openFileDialog}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center space-x-2">
                  <Upload className="w-5 h-5" />
                  <span>Upload Your Agent</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-muted/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Features for Modern AI Agents
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create intelligence dynamic agentic systems
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Bot,
                  title: "AI Agent Enhancement",
                  description: "Upload your Google ADK agent and enhance it with intelligent prompting capabilities and dynamic responses.",
                  color: "text-blue-600"
                },
                {
                  icon: Code,
                  title: "Dynamic Conversations",
                  description: "Create branching conversation flows and context-aware agent responses that adapt to user interactions.",
                  color: "text-green-600"
                },
                {
                  icon: Zap,
                  title: "Real-Time Reinforcement Learning",
                  description: "Train your prompts, leveraging evaluation metrics and a reinforcement learning pipeline to optimize agentic system prompts.",
                  color: "text-purple-600"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/80 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
                >
                  <div className={`w-12 h-12 rounded-lg bg-accent/50 flex items-center justify-center mb-4 group-hover:bg-accent/80 transition-colors`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get Started in Minutes
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload your Google ADK agent and start enhancing it with intelligent prompting
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-xl">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Upload className={`w-16 h-16 transition-all duration-300`} />
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-lg" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xl font-semibold mb-2">Drop your ZIP file here</p>
                    <p className="text-muted-foreground">or click to browse files</p>
                  </div>
                  
                  <Button
                    onClick={openFileDialog}
                    variant="outline"
                    size="lg"
                    className="border-border hover:bg-accent/50 hover:border-primary/50 transition-all duration-300"
                  >
                    Choose File
                  </Button>
                </div>

              </div>

              {/* Instructions */}
              <div className="mt-8 p-6 bg-muted/30 border border-border rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center">
                  <File className="w-5 h-5 mr-2 text-primary" />
                  How to prepare your agent folder:
                </h4>
                <ol className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">1</span>
                    Locate your Google ADK agent folder
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">2</span>
                    Select all files and folders in the agent directory
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">3</span>
                    Create a ZIP archive containing these files
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">4</span>
                    Upload the ZIP file above to get started
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border bg-muted/20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">VibePrompting</span>
            </div>
            <p className="text-muted-foreground">
              Built with Next.js, Flask, and Google ADK • Empowering the future of conversational AI
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

