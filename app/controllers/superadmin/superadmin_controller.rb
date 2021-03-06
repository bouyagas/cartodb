class Superadmin::SuperadminController < ActionController::Base
  include SslRequirement
  before_filter :authenticate

  # this disables SSL requirement in non-production environments (add "|| Rails.env.development?" for local https)
  unless Rails.env.production? || Rails.env.staging?
    def self.ssl_required(*splat)
      false
    end
    def self.ssl_allowed(*splat)
      true
    end
  end

  protected

  def authenticate
    return true if Rails.env.development? || authenticated?(CartoDB.extract_subdomain(request)) && current_user.admin
    authenticate_or_request_with_http_basic do |username, password|
      username == Cartodb.config[:superadmin]["username"] && password == Cartodb.config[:superadmin]["password"]
    end
  end

  def current_user
    super(CartoDB.extract_subdomain(request))
  end
end
