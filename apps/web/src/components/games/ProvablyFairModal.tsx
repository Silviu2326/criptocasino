'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline'

interface ProvablyFairModalProps {
  isOpen: boolean
  onClose: () => void
  gameType: string
}

export function ProvablyFairModal({ isOpen, onClose, gameType }: ProvablyFairModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const mockData = {
    clientSeed: 'user_generated_seed_12345',
    serverSeed: 'server_hashed_seed_abcdef',
    nonce: 1234,
    result: 47,
    hash: 'sha256_hash_of_combined_seeds'
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl card p-8 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold leading-6 text-white"
                  >
                    Provably Fair Verification - {gameType.charAt(0).toUpperCase() + gameType.slice(1)}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-white focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-casino-success/10 border border-casino-success/30 rounded-lg p-4">
                    <h4 className="text-casino-success font-semibold mb-2">
                      ✅ How Provably Fair Works
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Our provably fair system ensures that neither you nor we can manipulate the game results. 
                      Each bet uses a combination of your client seed, our server seed, and a nonce to generate 
                      cryptographically secure random numbers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-semibold">Current Game Seeds</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Client Seed (Your Input)</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={mockData.clientSeed}
                            readOnly
                            className="input flex-1 font-mono text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(mockData.clientSeed, 'client')}
                            className="btn btn-secondary btn-sm"
                          >
                            {copied === 'client' ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Server Seed Hash</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={mockData.serverSeed}
                            readOnly
                            className="input flex-1 font-mono text-sm"
                          />
                          <button
                            onClick={() => copyToClipboard(mockData.serverSeed, 'server')}
                            className="btn btn-secondary btn-sm"
                          >
                            {copied === 'server' ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <DocumentDuplicateIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Nonce</label>
                        <input
                          type="text"
                          value={mockData.nonce}
                          readOnly
                          className="input w-32 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-casino-card/50 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Last Result Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Result:</span>
                        <span className="text-white font-mono">{mockData.result}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Hash:</span>
                        <span className="text-white font-mono text-xs">{mockData.hash}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-semibold">Verify Yourself</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                      <li>Copy the client seed, server seed, and nonce above</li>
                      <li>Use our open-source verification script on GitHub</li>
                      <li>Combine the seeds with SHA256 hashing</li>
                      <li>Convert the result to determine the game outcome</li>
                    </ol>
                    
                    <div className="flex space-x-3 mt-4">
                      <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                      >
                        GitHub Verifier
                      </a>
                      <button className="btn btn-primary btn-sm">
                        Change Client Seed
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-600 text-center">
                  <p className="text-xs text-gray-500">
                    All games use cryptographically secure random number generation.
                    Results are deterministic and verifiable by anyone.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}