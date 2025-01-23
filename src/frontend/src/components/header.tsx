'use client'

import { useState } from "react"
import { Link } from "react-router-dom"
import {  Search, User, LogOut, ChevronDown } from 'lucide-react'
import { PiShoppingCartLight } from "react-icons/pi";
import { CiHeart, CiUser } from "react-icons/ci";
import { signOut } from "firebase/auth"
import { auth } from "../firebase"
import toast from "react-hot-toast"
import { User as UserType } from "../types/types"

interface PropsType {
  user: UserType | null
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const logoutHandler = async () => {
    try {
      await signOut(auth)
      toast.success("Sign Out Successfully")
      setIsOpen(false)
    } catch (error) {
      toast.error("Sign Out Fail")
    }
  }
  
  return (
    <div className="top-0 z-50 bg-white">
      {/* Top Banner */}
      <div className="w-full bg-black text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm">Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!</p>
            <button className="text-sm font-medium underline">ShopNow</button>
          </div>
          <button className="flex items-center gap-2 text-sm">
            English
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b">
        <div className="container mx-auto py-6 px-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold shrink-0"
              onClick={() => setIsOpen(false)}
            >
              Exclusive
            </Link>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/contact" 
                className="text-sm hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link 
                to="/about" 
                className="text-sm hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/signup" 
                className="text-sm hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </nav>

            {/* Search and Icons */}
            <div className="flex items-center gap-6 ml-auto">
              <div className="relative hidden lg:block">
                <input
                  type="search"
                  placeholder="What are you looking for?"
                  className="w-[300px] h-10 pl-4 pr-10 rounded-md bg-gray-100 border-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-4">
                <Link 
                  to="/search" 
                  className="lg:hidden hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="h-6 w-6" />
                </Link>
                <Link
                  to="/wishlist"
                  className="hover:text-primary"
                >
                  <CiHeart className="h-6 w-6" />
                </Link>
                <Link 
                  to="/cart" 
                  className="hover:text-primary relative"
                  onClick={() => setIsOpen(false)}
                >
                  <PiShoppingCartLight className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                    0
                  </span>
                </Link>

                {/* User Menu */}
                {user?._id ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsOpen((prev) => !prev)}
                      className="hover:text-primary"
                    >
                      <CiUser className="h-6 w-6" />
                    </button>
                    
                    {isOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1" role="menu">
                          <Link
                            to="/account"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <User className="mr-2 h-4 w-4" />
                            Manage My Account
                          </Link>
                          {user.role === "admin" && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Admin Dashboard
                            </Link>
                          )}
                          <Link
                            to="/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Orders
                          </Link>
                          <Link
                            to="/cancellations"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Cancellations
                          </Link>
                          <Link
                            to="/reviews"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            My Reviews
                          </Link>
                          <button
                            onClick={logoutHandler}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header

