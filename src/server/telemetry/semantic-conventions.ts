/**
 * Custom OpenTelemetry semantic convention constants
 * Based on OpenTelemetry Semantic Conventions Specification v1.32.0
 * @see https://opentelemetry.io/docs/specs/semconv/
 */

// HTTP-related attributes (stable)
export const ATTR_HTTP_REQUEST_METHOD = 'http.request.method'
export const ATTR_HTTP_ROUTE = 'http.route'
export const ATTR_HTTP_RESPONSE_STATUS_CODE = 'http.response.status_code'
export const ATTR_HTTP_REQUEST_BODY_SIZE = 'http.request.body.size'
export const ATTR_HTTP_RESPONSE_BODY_SIZE = 'http.response.body.size'

// URL-related attributes (replacing deprecated http.url)
export const ATTR_URL_FULL = 'url.full'
export const ATTR_URL_PATH = 'url.path'
export const ATTR_URL_QUERY = 'url.query'
export const ATTR_URL_SCHEME = 'url.scheme'

// Service-related attributes
export const ATTR_SERVICE_NAME = 'service.name'
export const ATTR_SERVICE_VERSION = 'service.version'
export const ATTR_SERVICE_INSTANCE_ID = 'service.instance.id'

// Database-related attributes
export const ATTR_DB_SYSTEM = 'db.system'
export const ATTR_DB_NAME = 'db.name'
export const ATTR_DB_STATEMENT = 'db.statement'
export const ATTR_DB_OPERATION = 'db.operation'
export const ATTR_DB_USER = 'db.user'
export const ATTR_DB_COLLECTION_NAME = 'db.collection.name'

// Exception-related attributes (stable)
export const ATTR_EXCEPTION_TYPE = 'exception.type'
export const ATTR_EXCEPTION_MESSAGE = 'exception.message'
export const ATTR_EXCEPTION_STACKTRACE = 'exception.stacktrace'

// User-related attributes
export const ATTR_ENDUSER_ID = 'enduser.id'
export const ATTR_ENDUSER_ROLE = 'enduser.role'

// Network-related attributes
export const ATTR_NETWORK_PROTOCOL_NAME = 'network.protocol.name'
export const ATTR_NETWORK_PROTOCOL_VERSION = 'network.protocol.version'

// Server and client attributes
export const ATTR_SERVER_ADDRESS = 'server.address'
export const ATTR_SERVER_PORT = 'server.port'
export const ATTR_CLIENT_ADDRESS = 'client.address'

// Custom attribute prefix
export const ATTR_APP_PREFIX = 'app.'

// Database system standard values
export const DB_SYSTEM_VALUE_POSTGRESQL = 'postgresql'
export const DB_SYSTEM_VALUE_SQLITE = 'sqlite'
