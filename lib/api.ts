/**
 * API Configuration for Frontend
 * Automatically uses production or development API URL
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * API Helper utilities
 */
export const api = {
  /**
   * Get full API URL for a path
   */
  url: (path: string): string => {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${API_URL}${normalizedPath}`;
  },

  /**
   * Fetch wrapper with default credentials and headers
   */
  async fetch(path: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(api.url(path), {
      ...options,
      credentials: 'include', // Always include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    return response;
  },

  /**
   * GET request
   */
  async get(path: string, options: RequestInit = {}) {
    return this.fetch(path, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  async post(path: string, data?: any, options: RequestInit = {}) {
    return this.fetch(path, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put(path: string, data?: any, options: RequestInit = {}) {
    return this.fetch(path, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async delete(path: string, options: RequestInit = {}) {
    return this.fetch(path, { ...options, method: 'DELETE' });
  },
};

// Export individual endpoint builders
export const endpoints = {
  // Auth
  auth: {
    register: () => api.url('/api/auth/register'),
    login: () => api.url('/api/auth/login'),
    logout: () => api.url('/api/auth/logout'),
  },

  // Users
  users: {
    me: () => api.url('/api/users/me/profile'),
    stats: () => api.url('/api/users/me/stats'),
    posts: () => api.url('/api/users/me/posts'),
    updateProfile: () => api.url('/api/users/me/profile'),
    byId: (id: string) => api.url(`/api/users/${id}`),
  },

  // Posts
  posts: {
    list: () => api.url('/api/posts'),
    byId: (id: string) => api.url(`/api/posts/${id}`),
    create: () => api.url('/api/posts'),
    update: (id: string) => api.url(`/api/posts/${id}`),
    delete: (id: string) => api.url(`/api/posts/${id}`),
    search: (query: string) => api.url(`/api/posts/search?query=${query}`),
    like: (id: string) => api.url(`/api/posts/${id}/like`),
    save: (id: string) => api.url(`/api/posts/${id}/save`),
    comments: (id: string) => api.url(`/api/posts/${id}/comments`),
  },
};
