.PHONY: deploy

PROJECT_DIR := /root/mat-focus

# ENV for frontend
# rm -f ./client/.env.production
# touch ./client/.env.production
# echo NAME="value" >> ./client/.env.production

# ENV for backend
# rm -f ./strapi-api/.env
# touch ./strapi-api/.env
# echo NAME="value" >> ./strapi-api/.env

deploy:
	ssh -o StrictHostKeyChecking=no "$$VPS_USER@$$VPS_USER" "\
		cd $(PROJECT_DIR) && \
		git pull origin $$BRANCH_NAME && \
		cd $(PROJECT_DIR) && \
		docker system prune --force && \
		docker compose -f $$DOCKER_COMPOSE_FILE build && \
		docker compose -f $$DOCKER_COMPOSE_FILE down && \
		docker compose -f $$DOCKER_COMPOSE_FILE up -d --build\
	"
