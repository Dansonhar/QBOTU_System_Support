const isLocal = window.location.hostname === 'localhost';
const isGitHubPages = window.location.hostname.includes('github.io');

export const DATA_MODE = isGitHubPages ? 'static' : 'api';

export const API_BASE_URL = isLocal
    ? 'http://localhost:3001/api'
    : (isGitHubPages ? '/QBOTU_System_Support_Web/data' : '/api');

export const IMAGE_BASE_URL = isLocal
    ? 'http://localhost:3001'
    : '';

export const BASE_PATH = '/QBOTU_System_Support_Web';
