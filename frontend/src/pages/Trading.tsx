import { Search, Filter, Download, Upload, AlertTriangle, CheckCircle, Clock, Activity, ChevronDown, ChevronRight, X, FileSpreadsheet, Upload as UploadIcon, ArrowLeft, Edit, Eye, EyeOff, Undo2, Redo2, HelpCircle, Trash2, Save, XCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import React from 'react'
import { TradeTieOutApi } from '../services/tradeTieOutApi'
import { TradeTieOutSummary, TradeDetails, CreateTradeTieOutRequest } from '../types'

// Helper to convert Excel serial date to JS date string
function excelDateToJSDate(serial: number) {
  const utc_days = Math.floor(serial - 25569)
  const utc_value = utc_days * 86400
  const date_info = new Date(utc_value * 1000)
  // Adjust for Excel's leap year bug
  return date_info.toISOString().split('T')[0]
}

// Helper to convert Excel serial time to HH:mm:ss
function excelTimeToJSTime(serial: number) {
  const totalSeconds = Math.round(86400 * (serial % 1))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Tooltip component
function Tooltip({ label, children }: { label: string, children: React.ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={-1}
    >
      {children}
      {show && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 -top-8 px-2 py-1 rounded bg-dark-800 text-xs text-white shadow-lg whitespace-nowrap pointer-events-none">
          {label}
        </span>
      )}
    </span>
  )
}

// Mock data for trade days
const tradeDays = [
  {
    date: '2024-01-15',
    displayDate: 'Monday, January 15, 2024',
    summary: {
      totalTrades: 45,
      matched: 42,
      pending: 2,
      discrepancies: 1,
      matchRate: 93.3
    },
    trades: [
      {
        id: 'TRADE-001',
        product: 'Crude Oil',
        volume: '1000 barrels',
        price: '$85.50',
        counterparty: 'Shell Trading',
        status: 'matched',
        discrepancies: 0
      },
      {
        id: 'TRADE-002',
        product: 'Natural Gas',
        volume: '500 MMBtu',
        price: '$3.20',
        counterparty: 'BP Energy',
        status: 'discrepancy',
        discrepancies: 1
      },
      {
        id: 'TRADE-003',
        product: 'Electricity',
        volume: '2000 MWh',
        price: '$65.80',
        counterparty: 'ExxonMobil',
        status: 'pending',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-14',
    displayDate: 'Sunday, January 14, 2024',
    summary: {
      totalTrades: 38,
      matched: 37,
      pending: 1,
      discrepancies: 0,
      matchRate: 97.4
    },
    trades: [
      {
        id: 'TRADE-004',
        product: 'Coal',
        volume: '5000 tons',
        price: '$45.20',
        counterparty: 'Peabody Energy',
        status: 'matched',
        discrepancies: 0
      },
      {
        id: 'TRADE-005',
        product: 'Renewables',
        volume: '1000 MWh',
        price: '$72.10',
        counterparty: 'NextEra Energy',
        status: 'matched',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-13',
    displayDate: 'Saturday, January 13, 2024',
    summary: {
      totalTrades: 52,
      matched: 49,
      pending: 2,
      discrepancies: 1,
      matchRate: 94.2
    },
    trades: [
      {
        id: 'TRADE-006',
        product: 'Crude Oil',
        volume: '2000 barrels',
        price: '$84.30',
        counterparty: 'Chevron',
        status: 'matched',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-12',
    displayDate: 'Friday, January 12, 2024',
    summary: {
      totalTrades: 41,
      matched: 39,
      pending: 1,
      discrepancies: 1,
      matchRate: 95.1
    },
    trades: [
      {
        id: 'TRADE-007',
        product: 'Natural Gas',
        volume: '750 MMBtu',
        price: '$3.15',
        counterparty: 'ConocoPhillips',
        status: 'matched',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-11',
    displayDate: 'Thursday, January 11, 2024',
    summary: {
      totalTrades: 48,
      matched: 46,
      pending: 2,
      discrepancies: 0,
      matchRate: 95.8
    },
    trades: [
      {
        id: 'TRADE-008',
        product: 'Electricity',
        volume: '1500 MWh',
        price: '$68.20',
        counterparty: 'Duke Energy',
        status: 'matched',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-10',
    displayDate: 'Wednesday, January 10, 2024',
    summary: {
      totalTrades: 35,
      matched: 33,
      pending: 1,
      discrepancies: 1,
      matchRate: 94.3
    },
    trades: [
      {
        id: 'TRADE-009',
        product: 'Crude Oil',
        volume: '1500 barrels',
        price: '$86.10',
        counterparty: 'Marathon Petroleum',
        status: 'matched',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-09',
    displayDate: 'Tuesday, January 9, 2024',
    summary: {
      totalTrades: 42,
      matched: 40,
      pending: 1,
      discrepancies: 1,
      matchRate: 95.2
    },
    trades: [
      {
        id: 'TRADE-010',
        product: 'Coal',
        volume: '3000 tons',
        price: '$47.80',
        counterparty: 'Arch Resources',
        status: 'matched',
        discrepancies: 0
      }
    ]
  },
  {
    date: '2024-01-08',
    displayDate: 'Monday, January 8, 2024',
    summary: {
      totalTrades: 39,
      matched: 37,
      pending: 2,
      discrepancies: 0,
      matchRate: 94.9
    },
    trades: [
      {
        id: 'TRADE-011',
        product: 'Renewables',
        volume: '800 MWh',
        price: '$74.50',
        counterparty: 'Invenergy',
        status: 'matched',
        discrepancies: 0
      }
    ]
  }
]

// Parent DTO - Updated to match backend types
export interface TradeTieOutDto {
  tradeTieOutId?: string;
  tradeDate: string;
  sideAFileImport?: string;
  sideAFileName: string;
  sideBFileImport?: string;
  sideBFileName: string;
  userName: string;
  systemTimestamp?: string;
  keyMatrix: Record<string, string>;
  createdDate?: string;
  modifiedDate?: string;
}

// Child DTO - Updated to match backend types
export interface TradeTieOutResultDto {
  tradeTieOutResultId?: string;
  ttoTradeTieOutId: string;
  tradeId: string;
  product: string;
  volume: string;
  price: string;
  counterparty: string;
  internalCompany: string;
  status: 'matched' | 'discrepancy' | 'pending';
  userName: string;
  systemDate?: string;
  createdDate?: string;
  modifiedDate?: string;
}

export default function Trading() {
  const [expandedDays, setExpandedDays] = useState<string[]>(['2024-01-15'])
  const [dateRange, setDateRange] = useState('Last 2 Weeks')
  const [showImportModal, setShowImportModal] = useState(false)
  const [sideAFile, setSideAFile] = useState<File | null>(null)
  const [sideBFile, setSideBFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [tradeDate, setTradeDate] = useState('')
  const [showUploadedData, setShowUploadedData] = useState(false)
  const [uploadedSideAData, setUploadedSideAData] = useState<any[]>([])
  const [uploadedSideBData, setUploadedSideBData] = useState<any[]>([])
  const [uploadedDate, setUploadedDate] = useState('')
  const [sideAOpen, setSideAOpen] = useState(true)
  const [sideBOpen, setSideBOpen] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTieoutModal, setShowTieoutModal] = useState(false)
  const [selectedColA, setSelectedColA] = useState('')
  const [selectedColB, setSelectedColB] = useState('')
  const [keyMatrix, setKeyMatrix] = useState<{ a: string, b: string }[]>([])
  const [compareLoading, setCompareLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string } | null>(null)

  // DTO State Management
  const [currentTradeTieOut, setCurrentTradeTieOut] = useState<Partial<TradeTieOutDto>>({
    tradeDate: '',
    sideAFileName: '',
    sideBFileName: '',
    userName: 'current-user', // This should come from auth context
    keyMatrix: {}
  })
  
  const [tradeTieOuts, setTradeTieOuts] = useState<TradeTieOutDto[]>([])
  const [tradeTieOutResults, setTradeTieOutResults] = useState<TradeTieOutResultDto[]>([])
  const [tradeTieOutSummaries, setTradeTieOutSummaries] = useState<TradeTieOutSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load trade tie-out data on component mount
  useEffect(() => {
    loadTradeTieOutData()
  }, [])

  const loadTradeTieOutData = async () => {
    setIsLoading(true)
    try {
      // Load trade tie-out summaries from API
      const response = await TradeTieOutApi.getTradeTieOuts()
      if (response.success && response.data) {
        setTradeTieOutSummaries(response.data)
      }
    } catch (error) {
      console.error('Error loading trade tie-out data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Transform trade tie-out summaries to the format expected by the UI
  const transformTradeDays = (): any[] => {
    return tradeTieOutSummaries.map(summary => ({
      date: summary.tradeDate,
      displayDate: formatDate(summary.tradeDate),
      tieOutId: summary.tieOutUser, // Using tieOutUser as identifier for now
      summary: {
        totalTrades: summary.totalTrades,
        matched: summary.matchedTrades,
        pending: summary.pendingTrades,
        discrepancies: summary.discrepancyTrades,
        matchRate: summary.matchRate
      },
      trades: [] // Will be populated when details are loaded
    }))
  }

  // Update current trade tie-out as user progresses
  const updateCurrentTradeTieOut = (updates: Partial<TradeTieOutDto>) => {
    setCurrentTradeTieOut(prev => ({ ...prev, ...updates }))
  }

  // Handle file upload with DTO updates
  const handleFileUpload = (file: File | null, side: 'A' | 'B') => {
    if (side === 'A') {
      setSideAFile(file)
      updateCurrentTradeTieOut({ 
        sideAFileName: file?.name || '',
        sideAFileImport: file ? 'file-data-placeholder' : '' // In real app, this would be file content
      })
    } else {
      setSideBFile(file)
      updateCurrentTradeTieOut({ 
        sideBFileName: file?.name || '',
        sideBFileImport: file ? 'file-data-placeholder' : '' // In real app, this would be file content
      })
    }
  }

  // Handle trade date selection with DTO updates
  const handleTradeDateChange = (date: string) => {
    setTradeDate(date)
    updateCurrentTradeTieOut({ tradeDate: date })
  }

  // Handle key matrix updates
  const handleAddMapping = () => {
    if (selectedColA && selectedColB && !keyMatrix.some(pair => pair.a === selectedColA || pair.b === selectedColB)) {
      const newKeyMatrix = [...keyMatrix, { a: selectedColA, b: selectedColB }]
      setKeyMatrix(newKeyMatrix)
      
      // Update DTO with key matrix
      const keyMatrixRecord: Record<string, string> = {}
      newKeyMatrix.forEach(pair => {
        keyMatrixRecord[pair.a] = pair.b
      })
      updateCurrentTradeTieOut({ keyMatrix: keyMatrixRecord })
      
      setSelectedColA('')
      setSelectedColB('')
    }
  }

  // Save trade tie-out and results to backend
  const saveTradeTieOut = async (tieOutData: Partial<TradeTieOutDto>, resultsData: Omit<TradeTieOutResultDto, 'tradeTieOutResultId' | 'ttoTradeTieOutId' | 'systemDate' | 'createdDate' | 'modifiedDate'>[]) => {
    try {
      const requestData: CreateTradeTieOutRequest = {
        tradeDate: tieOutData.tradeDate || '',
        sideAFileImport: tieOutData.sideAFileImport,
        sideAFileName: tieOutData.sideAFileName || '',
        sideBFileImport: tieOutData.sideBFileImport,
        sideBFileName: tieOutData.sideBFileName || '',
        userName: tieOutData.userName || 'current-user',
        keyMatrix: tieOutData.keyMatrix || {},
        results: resultsData
      }
      
      const response = await TradeTieOutApi.createTradeTieOut(requestData)
      
      if (response.success && response.data) {
        // Refresh the trade tie-out summaries
        await loadTradeTieOutData()
        return response.data.tieOut
      } else {
        throw new Error(response.message || 'Failed to save trade tie-out')
      }
    } catch (error) {
      console.error('Error saving trade tie-out:', error)
      throw error
    }
  }

  const toggleDay = (date: string) => {
    setExpandedDays(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-500/20 text-success-400">
            <CheckCircle size={12} className="mr-1" />
            Matched
          </span>
        )
      case 'discrepancy':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-500/20 text-danger-400">
            <AlertTriangle size={12} className="mr-1" />
            Discrepancy
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-500/20 text-warning-400">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        )
      default:
        return null
    }
  }



  const parseFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext === 'xlsx' || ext === 'xls') {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer)
            const workbook = XLSX.read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            let json = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
            // Convert Excel serial dates/times to readable strings
            if (json.length > 0) {
              const headers = Object.keys(json[0] as any)
              json = json.map((row: any) => {
                const newRow: any = { ...row }
                headers.forEach((header) => {
                  const value = row[header]
                  if (
                    typeof value === 'number' &&
                    /date|time/i.test(header)
                  ) {
                    if (/date/i.test(header)) {
                      newRow[header] = excelDateToJSDate(value)
                    } else if (/time/i.test(header)) {
                      // If value is > 1, it's a date+time, so get only the time part
                      newRow[header] = excelTimeToJSTime(value)
                    }
                  }
                })
                return newRow
              })
            }
            resolve(json as any[])
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsArrayBuffer(file)
      } else {
        // CSV fallback
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string
            const lines = text.split('\n')
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
            const data = lines.slice(1).filter(line => line.trim()).map(line => {
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
              const row: any = {}
              headers.forEach((header, index) => {
                row[header] = values[index] || ''
              })
              return row
            })
            resolve(data)
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = reject
        reader.readAsText(file)
      }
    })
  }

  const handleImportTrades = async () => {
    if (!sideAFile || !sideBFile) {
      alert('Please upload both Side A and Side B files')
      return
    }

    if (!tradeDate) {
      alert('Please select a trade date')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Parse both files (Excel or CSV)
      const [sideAData, sideBData] = await Promise.all([
        parseFile(sideAFile),
        parseFile(sideBFile)
      ])

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            setShowImportModal(false)
            setSideAFile(null)
            setSideBFile(null)
            setTradeDate('')
            setUploadProgress(0)
            
            // Set the uploaded data for display
            setUploadedSideAData(sideAData)
            setUploadedSideBData(sideBData)
            setUploadedDate(tradeDate)
            setShowUploadedData(true)
            
            return 100
          }
          return prev + 10
        })
      }, 200)

    } catch (error) {
      console.error('Error parsing files:', error)
      alert('Error parsing the uploaded files. Please check the file format.')
      setIsUploading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }



  // Toolbar button handlers (stubs)
  const handleEdit = () => setShowEditModal(true)
  const handleReset = () => window.location.reload() // Simple reset for now
  const handleDownload = () => alert('Download functionality coming soon!')
  const handleColumnVisibility = () => alert('Column visibility coming soon!')
  const handleHelp = () => alert('Help coming soon!')
  const handleContinueTieout = () => setShowTieoutModal(true)

  // Compare logic
  const handleCompare = async () => {
    setCompareLoading(true)
    setTimeout(async () => {
      try {
        // Build a lookup for Side B rows by key
        const keyA = keyMatrix.map(pair => pair.a)
        const keyB = keyMatrix.map(pair => pair.b)
        const sideBLookup = new Map<string, any>()
        uploadedSideBData.forEach(rowB => {
          const key = keyB.map(col => (rowB[col] ?? '')).join('||')
          sideBLookup.set(key, rowB)
        })
        
        // Compare each row in Side A
        const comparedTrades = uploadedSideAData.map(rowA => {
          const key = keyA.map(col => (rowA[col] ?? '')).join('||')
          const match = sideBLookup.get(key)
          return {
            ...rowA,
            status: match ? 'matched' : 'discrepancy',
            matchedRow: match || null
          }
        })
        
        // Create the trade tie-out DTO
        const tieOutData: TradeTieOutDto = {
          ...currentTradeTieOut,
          primaryKey: '', // Will be generated by backend
          systemTimestamp: new Date().toISOString()
        } as TradeTieOutDto
        
        // Create the trade tie-out result DTOs
        const resultsData: Omit<TradeTieOutResultDto, 'tradeTieOutResultId' | 'ttoTradeTieOutId' | 'systemDate' | 'createdDate' | 'modifiedDate'>[] = comparedTrades.map((trade, index) => ({
          tradeId: trade[keyA[0]] || `TRADE-${index + 1}`, // Use first key column as trade ID
          product: trade[keyA.find(col => /product|commodity/i.test(col)) || keyA[0]] || '',
          volume: trade[keyA.find(col => /volume|quantity/i.test(col)) || keyA[1]] || '',
          price: trade[keyA.find(col => /price|rate/i.test(col)) || keyA[2]] || '',
          counterparty: trade[keyA.find(col => /counterparty|client/i.test(col)) || keyA[3]] || '',
          internalCompany: 'Exodus Energy', // Default value
          status: trade.status as 'matched' | 'discrepancy' | 'pending',
          userName: currentTradeTieOut.userName || 'current-user'
        }))
        
        // Save to backend
        const savedTieOut = await saveTradeTieOut(tieOutData, resultsData)
        
        setShowTieoutModal(false)
        setCompareLoading(false)
        setNotification({
          message: `${comparedTrades.length} trade${comparedTrades.length !== 1 ? 's' : ''} added to ${formatDate(uploadedDate)}`
        })
        setTimeout(() => setNotification(null), 5000)
        
        // Reset form
        setCurrentTradeTieOut({
          tradeDate: '',
          sideAFileName: '',
          sideBFileName: '',
          userName: 'current-user',
          keyMatrix: {}
        })
        setKeyMatrix([])
        setSelectedColA('')
        setSelectedColB('')
        setSideAFile(null)
        setSideBFile(null)
        setTradeDate('')
        setShowUploadedData(false)
        
      } catch (error) {
        console.error('Error during comparison:', error)
        setCompareLoading(false)
        alert('Error saving trade tie-out data. Please try again.')
      }
    }, 800)
  }

  // If showing uploaded data, display that instead of the main interface
  if (showUploadedData) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowUploadedData(false)}
              className="flex items-center text-dark-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Trade Days
            </button>
            <div className="h-6 w-px bg-dark-700"></div>
            <div>
              <h1 className="text-2xl font-semibold text-white">Uploaded Trade Data</h1>
              <p className="text-sm text-dark-400 mt-1">Review uploaded data for {formatDate(uploadedDate)}</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between bg-dark-950/80 border border-dark-800 rounded-lg px-4 py-2 shadow mb-4">
          <div className="flex items-center space-x-2">
            <Tooltip label="Edit grid (rename/delete columns, delete rows)"><button onClick={handleEdit} className="flex items-center px-2 py-1 text-xs text-primary-300 hover:text-white hover:bg-primary-700/30 rounded transition-colors"><Edit size={16} className="mr-1" />Edit</button></Tooltip>
            <Tooltip label="Reset grids to original uploaded state"><button onClick={handleReset} className="flex items-center px-2 py-1 text-xs text-dark-300 hover:text-white hover:bg-dark-700/30 rounded transition-colors"><Undo2 size={16} className="mr-1" />Reset</button></Tooltip>
            <Tooltip label="Download both grids as CSV or Excel"><button onClick={handleDownload} className="flex items-center px-2 py-1 text-xs text-dark-300 hover:text-white hover:bg-dark-700/30 rounded transition-colors"><Download size={16} className="mr-1" />Download</button></Tooltip>
            <Tooltip label="Search rows/columns"><div className="relative"><input type="text" placeholder="Search..." className="pl-7 pr-2 py-1 bg-dark-900/40 border border-dark-800/40 rounded text-xs text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent" /><Search size={14} className="absolute left-2 top-1.5 text-dark-400" /></div></Tooltip>
            <Tooltip label="Show/hide columns"><button onClick={handleColumnVisibility} className="flex items-center px-2 py-1 text-xs text-dark-300 hover:text-white hover:bg-dark-700/30 rounded transition-colors"><Eye size={16} className="mr-1" />Columns</button></Tooltip>
            <Tooltip label="Help"><button onClick={handleHelp} className="flex items-center px-2 py-1 text-xs text-dark-300 hover:text-white hover:bg-dark-700/30 rounded transition-colors"><HelpCircle size={16} className="mr-1" />Help</button></Tooltip>
          </div>
          <Tooltip label="Continue to tie-out step"><button onClick={handleContinueTieout} className="ml-auto flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded transition-colors"><span>Continue Tie-out</span></button></Tooltip>
        </div>

        {/* Side A Data Dropdown */}
        <div className="mb-4">
          <button onClick={() => setSideAOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-2 bg-dark-900/80 border-b border-dark-800 focus:outline-none">
            <div className="flex items-center space-x-2">
              {sideAOpen ? <ChevronDown size={18} className="text-primary-400" /> : <ChevronRight size={18} className="text-primary-400" />}
              <span className="text-base font-semibold text-white">Side A - Trader Records</span>
              <span className="text-xs text-dark-400">({uploadedSideAData.length} records)</span>
            </div>
          </button>
          {sideAOpen && (
            <div className="bg-dark-950/80 border-x-2 border-b-2 border-primary-700 shadow-lg overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs">
                <thead className="bg-dark-800/80 sticky top-0 z-10">
                  <tr>
                    {uploadedSideAData.length > 0 && Object.keys(uploadedSideAData[0]).map((header) => (
                      <th key={header} className="px-2 py-2 text-left font-semibold text-primary-300 uppercase tracking-wider whitespace-nowrap border-b border-dark-700">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedSideAData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-dark-900/60' : 'bg-dark-800/40'}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="px-2 py-1 text-white whitespace-nowrap border-b border-dark-800">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Side B Data Dropdown */}
        <div className="mb-4">
          <button onClick={() => setSideBOpen(v => !v)} className="w-full flex items-center justify-between px-4 py-2 bg-dark-900/80 border-b border-dark-800 focus:outline-none">
            <div className="flex items-center space-x-2">
              {sideBOpen ? <ChevronDown size={18} className="text-primary-400" /> : <ChevronRight size={18} className="text-primary-400" />}
              <span className="text-base font-semibold text-white">Side B - Risk Management Records</span>
              <span className="text-xs text-dark-400">({uploadedSideBData.length} records)</span>
            </div>
          </button>
          {sideBOpen && (
            <div className="bg-dark-950/80 border-x-2 border-b-2 border-primary-700 shadow-lg overflow-x-auto custom-scrollbar">
              <table className="w-full text-xs">
                <thead className="bg-dark-800/80 sticky top-0 z-10">
                  <tr>
                    {uploadedSideBData.length > 0 && Object.keys(uploadedSideBData[0]).map((header) => (
                      <th key={header} className="px-2 py-2 text-left font-semibold text-primary-300 uppercase tracking-wider whitespace-nowrap border-b border-dark-700">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedSideBData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-dark-900/60' : 'bg-dark-800/40'}>
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="px-2 py-1 text-white whitespace-nowrap border-b border-dark-800">{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Modal (stub) */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-900 border border-dark-800 rounded-lg w-full max-w-lg mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Edit Grid</h2>
                <button onClick={() => setShowEditModal(false)} className="text-dark-400 hover:text-white"><X size={22} /></button>
              </div>
              <div className="text-dark-400 text-sm mb-4">Editing functionality coming soon: rename columns, delete columns, delete rows.</div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors">Cancel</button>
                <button disabled className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg opacity-50 cursor-not-allowed">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Continue Tie-out Modal (key matrix) */}
        {showTieoutModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dark-900 border border-dark-800 rounded-lg w-full max-w-4xl mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Tie-out Key Matrix</h2>
                <button onClick={() => setShowTieoutModal(false)} className="text-dark-400 hover:text-white"><X size={22} /></button>
              </div>
              <div className="text-dark-400 text-sm mb-4">Select columns to tie together for reconciliation. Preview your data as you map columns.</div>

              <div className="flex flex-row gap-8">
                {/* Data Preview Section */}
                <div className="flex-1 min-w-0">
                  <div className="mb-4">
                    <div className="text-xs text-primary-300 font-semibold mb-1">Side A Data Preview</div>
                    <div className="bg-dark-900/80 border border-dark-800 rounded p-2 overflow-x-auto custom-scrollbar">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            {uploadedSideAData.length > 0 && Object.keys(uploadedSideAData[0]).map((header) => (
                              <th key={header} className="px-2 py-1 text-left text-primary-300 font-semibold whitespace-nowrap border-b border-dark-800">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedSideAData.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-dark-900/60' : 'bg-dark-800/40'}>
                              {Object.values(row).map((value: any, cellIdx) => (
                                <td key={cellIdx} className="px-2 py-1 text-white whitespace-nowrap border-b border-dark-800">{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-primary-300 font-semibold mb-1">Side B Data Preview</div>
                    <div className="bg-dark-900/80 border border-dark-800 rounded p-2 overflow-x-auto custom-scrollbar">
                      <table className="w-full text-xs">
                        <thead>
                          <tr>
                            {uploadedSideBData.length > 0 && Object.keys(uploadedSideBData[0]).map((header) => (
                              <th key={header} className="px-2 py-1 text-left text-primary-300 font-semibold whitespace-nowrap border-b border-dark-800">{header}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {uploadedSideBData.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-dark-900/60' : 'bg-dark-800/40'}>
                              {Object.values(row).map((value: any, cellIdx) => (
                                <td key={cellIdx} className="px-2 py-1 text-white whitespace-nowrap border-b border-dark-800">{value}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Mapping UI Section */}
                <div className="flex-1 min-w-0">
                  {/* Pairwise Column Selection UI */}
                  <div className="flex flex-row gap-6 items-end mb-8">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-white mb-1">Side A (Trader) Column</label>
                      <select
                        className="w-full bg-dark-900/80 border border-dark-800 rounded px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
                        value={selectedColA}
                        onChange={e => setSelectedColA(e.target.value)}
                      >
                        <option value="">Select column...</option>
                        {uploadedSideAData.length > 0 && Object.keys(uploadedSideAData[0]).map((colA) => (
                          <option key={colA} value={colA} disabled={keyMatrix.some(pair => pair.a === colA)}>{colA}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-white mb-1">Side B (Risk Management) Column</label>
                      <select
                        className="w-full bg-dark-900/80 border border-dark-800 rounded px-2 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
                        value={selectedColB}
                        onChange={e => setSelectedColB(e.target.value)}
                      >
                        <option value="">Select column...</option>
                        {uploadedSideBData.length > 0 && Object.keys(uploadedSideBData[0]).map((colB) => (
                          <option key={colB} value={colB} disabled={keyMatrix.some(pair => pair.b === colB)}>{colB}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="ml-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded transition-colors disabled:bg-dark-700 disabled:text-dark-400"
                      onClick={handleAddMapping}
                      disabled={!selectedColA || !selectedColB || keyMatrix.some(pair => pair.a === selectedColA || pair.b === selectedColB)}
                    >
                      Add Mapping
                    </button>
                  </div>

                  {/* Key Matrix List Boxes */}
                  <div className="mt-2">
                    <h3 className="text-sm font-semibold text-white mb-2">Key Matrix</h3>
                    <div className="flex flex-row gap-6">
                      <div className="flex-1">
                        <div className="bg-dark-900/80 border border-dark-800 rounded p-2 min-h-[120px]">
                          <div className="text-xs text-primary-300 font-semibold mb-2">Side A Columns</div>
                          {keyMatrix.length === 0 ? (
                            <div className="text-xs text-dark-400 italic">No mappings yet</div>
                          ) : (
                            keyMatrix.map((pair, idx) => (
                              <div key={idx} className="text-xs text-white py-1 border-b border-dark-800 last:border-b-0">{pair.a}</div>
                            ))
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="bg-dark-900/80 border border-dark-800 rounded p-2 min-h-[120px]">
                          <div className="text-xs text-primary-300 font-semibold mb-2">Side B Columns</div>
                          {keyMatrix.length === 0 ? (
                            <div className="text-xs text-dark-400 italic">No mappings yet</div>
                          ) : (
                            keyMatrix.map((pair, idx) => (
                              <div key={idx} className="text-xs text-white py-1 border-b border-dark-800 last:border-b-0">{pair.b}</div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-2">
                <button onClick={() => setShowTieoutModal(false)} className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors">Cancel</button>
                <button
                  onClick={handleCompare}
                  disabled={keyMatrix.length === 0 || compareLoading}
                  className={`px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors duration-200 ${keyMatrix.length === 0 || compareLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {compareLoading ? 'Comparing...' : 'Compare'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Transform DTOs to trade days format and apply filtering
  const allTradeDays = transformTradeDays().filter(day => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    switch (dateRange) {
      case 'Today':
        return day.date === todayStr
      case 'Last Week':
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        return new Date(day.date) >= lastWeek
      case 'Last 2 Weeks':
        const last2Weeks = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)
        return new Date(day.date) >= last2Weeks
      case 'Last Month':
        const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
        return new Date(day.date) >= lastMonth
      case 'YTD':
        const ytd = new Date(today.getFullYear(), 0, 1)
        return new Date(day.date) >= ytd
      case 'Last Year':
        const lastYear = new Date(today.getFullYear() - 1, 0, 1)
        const thisYear = new Date(today.getFullYear(), 0, 1)
        return new Date(day.date) >= lastYear && new Date(day.date) < thisYear
      case 'All':
      default:
        return true
    }
  })

  // Calculate summary stats from actual data
  const calculateSummaryStats = () => {
    const allResults = tradeTieOutResults
    const totalTrades = allResults.length
    const matched = allResults.filter(r => r.status === 'matched').length
    const pending = allResults.filter(r => r.status === 'pending').length
    const discrepancies = allResults.filter(r => r.status === 'discrepancy').length
    const matchRate = totalTrades > 0 ? ((matched / totalTrades) * 100).toFixed(1) : '0.0'
    
    return { totalTrades, matched, pending, discrepancies, matchRate }
  }

  const summaryStats = calculateSummaryStats()

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-dark-400">Loading trade data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Trade Tie-out</h1>
          <p className="text-sm text-dark-400 mt-1">Review and reconcile trades between traders and risk management • {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-dark-400">
          <Activity size={16} />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Matched Trades</p>
              <p className="text-2xl font-bold text-white mt-1">{summaryStats.matched}</p>
              <p className="text-xs text-success-400 mt-1">From {tradeTieOuts.length} sessions</p>
            </div>
            <div className="w-10 h-10 bg-success-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-success-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Pending Review</p>
              <p className="text-2xl font-bold text-white mt-1">{summaryStats.pending}</p>
              <p className="text-xs text-warning-400 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <Clock className="text-warning-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Discrepancies</p>
              <p className="text-2xl font-bold text-white mt-1">{summaryStats.discrepancies}</p>
              <p className="text-xs text-danger-400 mt-1">Critical issues</p>
            </div>
            <div className="w-10 h-10 bg-danger-500/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-danger-400" size={18} />
            </div>
          </div>
        </div>
        
        <div className="bg-dark-900/40 border border-dark-800/40 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-dark-400 uppercase tracking-wider">Match Rate</p>
              <p className="text-2xl font-bold text-white mt-1">{summaryStats.matchRate}%</p>
              <p className="text-xs text-primary-400 mt-1">Overall rate</p>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Activity className="text-primary-400" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={16} />
              <input
                type="text"
                placeholder="Search trades by ID, counterparty, or commodity..."
                className="pl-10 pr-4 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
              />
            </div>
            <select className="px-3 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent [&>option]:bg-dark-900 [&>option]:text-white">
              <option>All Status</option>
              <option>Pending</option>
              <option>Matched</option>
              <option>Discrepancy</option>
              <option>Approved</option>
            </select>
            <select className="px-3 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent [&>option]:bg-dark-900 [&>option]:text-white">
              <option>All Commodities</option>
              <option>Crude Oil</option>
              <option>Natural Gas</option>
              <option>Electricity</option>
              <option>Coal</option>
              <option>Renewables</option>
            </select>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent [&>option]:bg-dark-900 [&>option]:text-white"
            >
              <option>All</option>
              <option>Last Year</option>
              <option>YTD</option>
              <option>Last Month</option>
              <option>Last 2 Weeks</option>
              <option>Last Week</option>
              <option>Today</option>
            </select>
            <button className="flex items-center px-3 py-2 text-sm text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors duration-200">
              <Filter size={16} className="mr-2" />
              Filters
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-4 py-2 bg-dark-800/50 hover:bg-dark-800/70 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              <Upload size={16} className="mr-2" />
              Import Trades
            </button>
            <button className="flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              <Download size={16} className="mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Trade Days List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Trade Days</h2>
          <div className="text-sm text-dark-400">
            Showing {allTradeDays.length} day{allTradeDays.length !== 1 ? 's' : ''} • {dateRange}
          </div>
        </div>
        
        {allTradeDays.length === 0 ? (
          <div className="bg-dark-900/30 border border-dark-800/30 rounded-lg p-8 text-center">
            <div className="text-dark-400 mb-2">No trade days found for the selected period</div>
            <div className="text-sm text-dark-500">Try adjusting your date range filter</div>
          </div>
        ) : (
          allTradeDays.map((day) => (
            <div key={day.date} className="bg-dark-900/30 border border-dark-800/30 rounded-lg overflow-hidden">
              {/* Day Header - Clickable to expand/collapse */}
              <button
                onClick={() => toggleDay(day.date)}
                className="w-full p-5 text-left hover:bg-dark-800/10 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {expandedDays.includes(day.date) ? (
                      <ChevronDown className="text-dark-400" size={20} />
                    ) : (
                      <ChevronRight className="text-dark-400" size={20} />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{day.displayDate}</h3>
                      <div className="flex items-center space-x-6 mt-1 text-sm text-dark-400">
                        <span>{day.summary.totalTrades} total trades</span>
                        <span className="text-success-400">{day.summary.matched} matched</span>
                        <span className="text-warning-400">{day.summary.pending} pending</span>
                        <span className="text-danger-400">{day.summary.discrepancies} discrepancies</span>
                        <span className="text-primary-400">{day.summary.matchRate}% match rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-dark-400">Match Rate</div>
                      <div className="text-lg font-semibold text-white">{day.summary.matchRate}%</div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Expanded Content - Trades Grid */}
              {expandedDays.includes(day.date) && (
                <div className="border-t border-dark-800/30">
                  <div className="p-5">
                    {/* File Information Section */}
                    {(() => {
                      const tieOut = tradeTieOuts.find(t => t.tradeDate === day.date)
                      if (tieOut) {
                        return (
                          <div className="mb-6 p-4 bg-dark-800/30 border border-dark-700 rounded-lg">
                            <h4 className="text-sm font-semibold text-primary-300 mb-3 uppercase tracking-wider">Comparison Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <FileSpreadsheet size={16} className="text-primary-400" />
                                  <span className="text-xs font-medium text-white">Side A - Trader Records</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-dark-300">{tieOut.sideAFileName}</span>
                                  <button 
                                    className="flex items-center px-2 py-1 text-xs text-primary-400 hover:text-primary-300 hover:bg-primary-700/20 rounded transition-colors"
                                    onClick={() => alert('Download functionality coming soon!')}
                                  >
                                    <Download size={14} className="mr-1" />
                                    Download
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <FileSpreadsheet size={16} className="text-primary-400" />
                                  <span className="text-xs font-medium text-white">Side B - Risk Management Records</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-dark-300">{tieOut.sideBFileName}</span>
                                  <button 
                                    className="flex items-center px-2 py-1 text-xs text-primary-400 hover:text-primary-300 hover:bg-primary-700/20 rounded transition-colors"
                                    onClick={() => alert('Download functionality coming soon!')}
                                  >
                                    <Download size={14} className="mr-1" />
                                    Download
                                  </button>
                                </div>
                              </div>
                            </div>
                                                          <div className="flex items-center justify-between text-xs text-dark-400 border-t border-dark-700 pt-3">
                                <div className="flex items-center space-x-4">
                                  <span>Compared by: <span className="text-white font-medium">{tieOut.userName}</span></span>
                                  <span>Validated: <span className="text-white font-medium">{tieOut.systemTimestamp ? new Date(tieOut.systemTimestamp).toLocaleString() : 'N/A'}</span></span>
                                </div>
                              <div className="flex items-center space-x-2">
                                <span>Key mappings: <span className="text-white font-medium">{Object.keys(tieOut.keyMatrix).length}</span></span>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      return null
                    })()}
                    
                    <h4 className="text-md font-medium text-white mb-4">Trades for {day.displayDate}</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-dark-800/20">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Trade ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Volume</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Counterparty</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-800/30">
                          {day.trades.map((trade: any) => (
                            <tr key={trade.id} className="hover:bg-dark-800/10 transition-colors duration-200">
                              <td className="px-4 py-3 text-white font-mono text-sm">{trade.id}</td>
                              <td className="px-4 py-3 text-white">{trade.product}</td>
                              <td className="px-4 py-3 text-white">{trade.volume}</td>
                              <td className="px-4 py-3 text-white">{trade.price}</td>
                              <td className="px-4 py-3 text-white">{trade.counterparty}</td>
                              <td className="px-4 py-3">
                                {getStatusBadge(trade.status)}
                              </td>
                              <td className="px-4 py-3">
                                <button className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
                                  {trade.status === 'matched' ? 'View Details' : 
                                   trade.status === 'discrepancy' ? 'Review' : 'Add Record'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Import Trades Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-dark-900 border border-dark-800 rounded-lg w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-dark-800">
              <h2 className="text-xl font-semibold text-white">Import Trades</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-dark-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="text-sm text-dark-400">
                Upload Excel files containing trade data for reconciliation. You need to provide both Side A (Trader) and Side B (Risk Management) files.
              </div>

              {/* File Upload Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Side A Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">Side A - Trader Records</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'A')}
                      className="hidden"
                      id="sideA-upload"
                    />
                    <label
                      htmlFor="sideA-upload"
                      className={`block w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        sideAFile 
                          ? 'border-success-500 bg-success-500/10' 
                          : 'border-dark-700 hover:border-dark-600 bg-dark-800/30'
                      }`}
                    >
                      <div className="text-center">
                        {sideAFile ? (
                          <div className="space-y-2">
                            <FileSpreadsheet className="mx-auto text-success-400" size={32} />
                            <div className="text-sm font-medium text-white">{sideAFile.name}</div>
                            <div className="text-xs text-success-400">File uploaded successfully</div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadIcon className="mx-auto text-dark-400" size={32} />
                            <div className="text-sm font-medium text-white">Click to upload Side A file</div>
                            <div className="text-xs text-dark-400">Excel or CSV files (.xlsx, .xls, .csv)</div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Side B Upload */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white">Side B - Risk Management Records</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => handleFileUpload(e.target.files?.[0] || null, 'B')}
                      className="hidden"
                      id="sideB-upload"
                    />
                    <label
                      htmlFor="sideB-upload"
                      className={`block w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        sideBFile 
                          ? 'border-success-500 bg-success-500/10' 
                          : 'border-dark-700 hover:border-dark-600 bg-dark-800/30'
                      }`}
                    >
                      <div className="text-center">
                        {sideBFile ? (
                          <div className="space-y-2">
                            <FileSpreadsheet className="mx-auto text-success-400" size={32} />
                            <div className="text-sm font-medium text-white">{sideBFile.name}</div>
                            <div className="text-xs text-success-400">File uploaded successfully</div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <UploadIcon className="mx-auto text-dark-400" size={32} />
                            <div className="text-sm font-medium text-white">Click to upload Side B file</div>
                            <div className="text-xs text-dark-400">Excel or CSV files (.xlsx, .xls, .csv)</div>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Trade Date Picker */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-white">Trade Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={tradeDate}
                    onChange={(e) => handleTradeDateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-900/40 border border-dark-800/40 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="text-xs text-dark-400">
                  Select the trade date for all trades in the uploaded files. This date will be used for reconciliation and reporting.
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Processing files...</span>
                    <span className="text-dark-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* File Requirements */}
              <div className="bg-dark-800/30 border border-dark-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white mb-2">File Requirements</h4>
                <ul className="text-xs text-dark-400 space-y-1">
                  <li>• Excel files (.xlsx or .xls format)</li>
                  <li>• First row should contain column headers</li>
                  <li>• Required columns: Trade ID, Product, Volume, Price, Counterparty, Trade Date</li>
                  <li>• Maximum file size: 10MB per file</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-dark-800">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImportTrades}
                disabled={!sideAFile || !sideBFile || !tradeDate || isUploading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-dark-700 disabled:text-dark-400 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                {isUploading ? 'Processing...' : 'Import Trades'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-dark-900 border border-primary-700 text-white px-6 py-3 rounded shadow-lg flex items-center space-x-2 animate-fade-in">
          <span className="text-primary-400 font-bold">✔</span>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #23272e;
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #374151;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #23272e #111;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease;
        }
      `}</style>
    </div>
  )
} 