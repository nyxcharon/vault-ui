# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Added
- Added support for easily configuring multiple auth methods[#25](https://github.com/nyxcharon/vault-ui/issues/25)
- Added support for custom userpass mounts
### Changed
- Updated readme to have a proper getting started guide - [#14](https://github.com/nyxcharon/vault-ui/issues/14)
- Health check page now needs VAULT_PORT define to work correctly
- Health check page no longer will crash if an error occurs

## [1.0.0] - 2016-11-18
### Added
- Initial Vault UI re-written with Flask
- Support for Userpass and LDAP Auth
- This changelog and a license file

## [0.0.1] - 2016-5-2
### Added
- Vault UI written in react, with support for userpass